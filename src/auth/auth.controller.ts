import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDTO, RefTokenDTO, RegisterUserDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiResponseDTO } from '@/app.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() userData: RegisterUserDTO,
  ): Promise<ApiResponseDTO> {
    await this.authService.registerUser(userData);
    return new ApiResponseDTO({
      message: 'User created succesfully. Please, login',
    });
  }

  @Post('login')
  async loginUser(@Body() userData: LoginUserDTO): Promise<ApiResponseDTO> {
    const tokens = await this.authService.loginUser(userData);
    return new ApiResponseDTO({
      message: 'User logged in succesfully.',
      data: tokens,
    });
  }

  @Post('get-tokens')
  async refreshToken(@Body() tokenData: RefTokenDTO): Promise<ApiResponseDTO> {
    const tokens = await this.authService.refreshToken(tokenData.refreshToken);
    return new ApiResponseDTO({
      message: 'Tokens generated succesfully',
      data: tokens,
    });
  }
}
