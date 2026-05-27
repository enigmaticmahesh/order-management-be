import { AuthGuard } from '@/sharedcore/guards/auth.guard';
import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FullUserDTO } from './user.dto';
import { ApiResponseDTO } from '@/app.dto';
import { CurrentUser } from '@/sharedcore/decorators/current-user.decorator';
import { type TokenPayload } from '@/sharedcore/sharedcore.interface';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  async getUser(@CurrentUser() userPayload: TokenPayload) {
    const user = await this.userService.findUserDataById(userPayload.sub);
    if (!user) {
      throw new NotFoundException();
    }
    const userData = new FullUserDTO(user);
    return new ApiResponseDTO({
      message: 'Fetched your details succesfully',
      data: userData,
    });
  }
}
