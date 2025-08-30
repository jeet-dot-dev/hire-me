import { Hono } from "hono"

import generateRoute from "./routes/generateRoute";
import { corsMiddleware } from "./middlewares/cors";
import { honoRateLimit } from "./middlewares/rateLimit";

const app = new Hono<{
  Bindings: {
    OPENAI_API_KEY: string;
    APP_URL: string;
    GEMINI_API_KEY_NEW: string;
  };
}>();

// Apply global middlewares
app.use(corsMiddleware);
app.use("/api/*", honoRateLimit()); // Global rate limiting for all API routes

app.route("/api/v1",generateRoute);
app.get('*',(c)=>c.text("404 Page Not Found"));

export default app ;