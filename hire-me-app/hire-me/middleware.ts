import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const CANDIDATE_ROUTES = ["/candidate"];
const RECRUITER_ROUTES = ["/recruiter"];
const AUTH_ROUTES = ["/auth/login","/auth/register"] ;

export async function middleware(req:NextRequest) {
    const token = await getToken({req,secret: process.env.NEXTAUTH_SECRET});
    const {pathname} = req.nextUrl ;
    // console.log("hi",pathname);
    //   console.log("token:", token);

     // Helper flags
     const isAuthed = !!token;
     const isCandidate = token?.role === "CANDIDATE";
     const isRecruiter = token?.role === "RECRUITER";

      /* ---------- unauthenticated redirects ---------- */
      if(!isAuthed && (pathname.startsWith("/candidate")||pathname.startsWith("/recruiter"))){
        return NextResponse.redirect(new URL("/auth/login",req.url));
      }
      /* ---------- role‑based redirects ---------- */
      if(isCandidate && RECRUITER_ROUTES.some(path => pathname.startsWith(path))){
        return NextResponse.redirect(new URL("/candidate/dashboard",req.url))
      }
      if(isRecruiter && CANDIDATE_ROUTES.some(path => pathname.startsWith(path))){
          return NextResponse.redirect(new URL("/recruiter/dashboard",req.url))
      }
       /* ---------- prevent authed users visiting /login or /register ---------- */
       if(isAuthed && AUTH_ROUTES.includes(pathname)){
       return NextResponse.redirect(new URL("/extra/redirect-me", req.url));

       }
     return NextResponse.next();      
}

export const config = {
  // run on every route except _next/static, images, etc.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};