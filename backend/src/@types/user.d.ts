export type Role = "user" | "admin" | "admin_master";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateLoginUser {
  name?: string;
  email?: string;
  password?: string;
}