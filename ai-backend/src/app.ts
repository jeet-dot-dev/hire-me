import { Hono } from "hono"
import {cors} from "hono/cors"
import generateRoute from "./routes/generateRoute";

const app = new Hono();

app.use(cors())

app.route("/api/v1",generateRoute);
app.get('*',(c)=>c.text("404 Page Not Found"));

export default app ;