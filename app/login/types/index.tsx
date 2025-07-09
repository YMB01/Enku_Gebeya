// types/index.ts
export interface User {
  Id: number; // Make required
  Username: string | null;
  PasswordHash: string;
  RoleId: number;
  Email: string | null;
  IsAdmin: boolean;
  CreatedAt: string;
}

export interface Role {
  Id: number; // Make required
  Name: string;
}

export interface UserInRole {
  UserId: number; // Make required
  RoleId: number;
  RoleName: string;
}