import { Hono } from "hono";
import getTagsFromOpenai from "../controllers/getTagsFromOpenai";
import getDescriptionFromOpenai from "../controllers/getDescriptionFromOpenai";
import getInstructionFromOpenai from "../controllers/getInstructionFromOpenai";

const generateRoute = new Hono();

generateRoute.post("/getTags",getTagsFromOpenai);
generateRoute.post("/getDescription",getDescriptionFromOpenai);
generateRoute.post("/getInstruction",getInstructionFromOpenai);

export default generateRoute ;