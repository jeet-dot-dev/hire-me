import { Hono } from "hono";
import getTagsFromOpenai from "../controllers/getTagsFromOpenai";
import getDescriptionFromOpenai from "../controllers/getDescriptionFromOpenai";


const generateRoute = new Hono<{
  Bindings: {
    OPENAI_API_KEY: string;
    APP_URL: string;
    GEMINI_API_KEY:string
  };
}>();

generateRoute.post("/getTags",getTagsFromOpenai);
generateRoute.post("/getDescription",getDescriptionFromOpenai);


export default generateRoute ;