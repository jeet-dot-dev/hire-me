import { Hono } from "hono";
import getTagsFromOpenai from "../controllers/getTagsFromOpenai";
import getDescriptionFromOpenai from "../controllers/getDescriptionFromOpenai";
import { strictRateLimit } from "../middlewares/rateLimit";

const generateRoute = new Hono<{
  Bindings: {
    OPENAI_API_KEY: string;
    APP_URL: string;
    GEMINI_API_KEY:string
  };
}>();

// Apply strict rate limiting to AI endpoints
generateRoute.post("/getTags", strictRateLimit, getTagsFromOpenai);
generateRoute.post("/getDescription", strictRateLimit, getDescriptionFromOpenai);

export default generateRoute ;