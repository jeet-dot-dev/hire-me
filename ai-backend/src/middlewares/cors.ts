// middleware/cors.ts
import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: "http://localhost:3000", // restrict to your frontend URL in prod
  allowMethods: ['POST'],
});
