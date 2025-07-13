import { Hono } from "hono"

import generateRoute from "./routes/generateRoute";
import { corsMiddleware } from "./middlewares/cors";

const app = new Hono<{
  Bindings: {
    OPENAI_API_KEY: string;
    APP_URL: string;
    GEMINI_API_KEY:string
  };
}>();

app.use(corsMiddleware)

app.route("/api/v1",generateRoute);
app.get('*',(c)=>c.text("404 Page Not Found"));

export default app ;