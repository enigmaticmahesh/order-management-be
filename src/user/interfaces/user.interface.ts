export interface User {
  id: string;
  email: string;
  password: string;
  roleId: number;
  createdAt: Date;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserWithRole {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export interface UserProfile {
  id: number;
  name: string;
}

export interface UserFullData extends UserWithRole {
  profile: UserProfile;
}
