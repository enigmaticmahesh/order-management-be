import { Exclude } from 'class-transformer';
import { UserWithRole } from './interfaces/user.interface';

export class UserDTO {
  id: string;
  email: string;

  @Exclude()
  password?: string;

  role: string;

  constructor(user: UserWithRole) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role.name;
  }
}
