import { Hono } from "hono";
import getTagsFromOpenai from "../controllers/getTagsFromOpenai";
import getDescriptionFromOpenai from "../controllers/getDescriptionFromOpenai";
import getInstructionFromOpenai from "../controllers/getInstructionFromOpenai";

const generateRoute = new Hono<{
  Bindings: {
    OPENAI_API_KEY: string;
    APP_URL: string;
    GEMINI_API_KEY:string
  };
}>();

generateRoute.post("/getTags",getTagsFromOpenai);
generateRoute.post("/getDescription",getDescriptionFromOpenai);
generateRoute.post("/getInstruction",getInstructionFromOpenai);

export default generateRoute ;