import * as argon2 from 'argon2';
import { DrizzleService } from '@/db/drizzle/drizzle.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDTO, RegisterUserDTO } from './dtos/auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserWithRole } from '@/user/interfaces/user.interface';
import { TokenPayload } from '@/sharedcore/sharedcore.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly ds: DrizzleService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private get db() {
    return this.ds.getDb();
  }

  async registerUser(userData: RegisterUserDTO): Promise<void> {
    const hashedPassword = await argon2.hash(userData.password).catch((err) => {
      this.logger.error('Error while password hashing:', err);
      throw new InternalServerErrorException(
        'An unexpected error occured during account creation',
      );
    });

    const { users, userProfiles } = this.ds.getSchema();

    await this.db
      .transaction(async (tx) => {
        // save user
        const { email, name } = userData;
        const newUserData: typeof users.$inferInsert = {
          email,
          password: hashedPassword,
          roleId: 2, // user role
        };

        const [newUser] = await tx
          .insert(users)
          .values(newUserData)
          .returning();

        // save profile
        const newUserProfileData: typeof userProfiles.$inferInsert = {
          userId: newUser.id,
          name,
        };
        await tx.insert(userProfiles).values(newUserProfileData);
      })
      .catch((err: any) => {
        this.logger.error('Error while creation:', err);
        if (err.cause.code === '23505') {
          throw new ConflictException('This email is already exists.');
        }
        throw new InternalServerErrorException(
          'An unexpected error occured during account creation',
        );
      });
  }

  private async _verifyUserPassword(
    hashedPwd: string,
    plainPwd: string,
  ): Promise<Boolean> {
    return argon2.verify(hashedPwd, plainPwd);
  }

  private async _generateAccessToken(user: UserWithRole): Promise<string> {
    const payload: TokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role.name,
    };

    const options: JwtSignOptions = {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
    };

    return this.jwtService.signAsync(payload, options).catch((err) => {
      this.logger.error('Could not generate access token:', err);
      throw new InternalServerErrorException('Could not generate access token');
    });
  }

  private async _generateRefreshToken(user: UserWithRole): Promise<string> {
    const payload = {
      sub: user.id,
    };

    const options: JwtSignOptions = {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    };

    return this.jwtService.signAsync(payload, options).catch((err) => {
      this.logger.error('Could not generate refresh token:', err);
      throw new InternalServerErrorException(
        'Could not generate refresh token',
      );
    });
  }

  private async _generateTokens(
    user: UserWithRole,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this._generateAccessToken(user);
    const refreshToken = await this._generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  // Login User
  async loginUser(
    userData: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByEmail(userData.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPwdValid = await this._verifyUserPassword(
      user.password,
      userData.password,
    );

    if (!isPwdValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this._generateTokens(user);

    return { accessToken, refreshToken };
  }

  // Generate tokens via refresh token
  async refreshToken(refToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid Token');
      }
      const tokens = this._generateTokens(user);
      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
