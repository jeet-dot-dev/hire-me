
import { Role
 } from "@/generated/prisma";

 declare module "next-auth" {
    interface User {
        id : string ;
        role :Role
    }
 }

 interface Session {
    user : {
         id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: Role;
    }
 }

 declare module "next-auth/jwt" {
    interface JWT {
        id : string ;
        email ?: string |null;
        role : Role
    }
 }

 declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
      role: Role;
    };
  }
}
