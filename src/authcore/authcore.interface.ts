export interface TokenPayload {
  email: string;
  sub: string; // user.id which is a uuid
  role: string; // user.role
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
