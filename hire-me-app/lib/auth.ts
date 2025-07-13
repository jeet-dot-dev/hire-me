import { getServerSession } from "next-auth/next";
import {authConfig} from "./authConfig";

export function auth(){
    return getServerSession(authConfig);
}