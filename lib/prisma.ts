import { PrismaClient } from "@/generated/prisma";

// Type casting globalThis to hold prisma (only in dev)
const globalForPrisma = globalThis as unknown as {prisma : PrismaClient}

// Use existing instance if available, or create a new one
export const prisma = globalForPrisma.prisma || new PrismaClient() ;

// In dev, store instance in globalThis so it's reused
if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma