import { Role } from "@/generated/prisma";

export type UserCredentials = {
  email: string;
  password: string;
  role: string;
};

export type AuthUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: Role;
};
