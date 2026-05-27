import { Exclude } from 'class-transformer';
import { UserFullData, UserWithRole } from './interfaces/user.interface';

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

export class FullUserDTO extends UserDTO {
  fullName: string;

  constructor(user: UserFullData) {
    super(user);
    this.id = user.id;
    this.email = user.email;
    this.role = user.role.name;
    this.fullName = user.profile.name;
  }
}
