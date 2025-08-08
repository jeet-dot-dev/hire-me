import { getR2SignedUploadUrl } from "@/lib/r2/getR2SignedUploadUrl";

export async function POST(request: Request) { 
    try {
        const {key,type} = await request.json();
        if (!key || typeof key !== 'string') {
            return new Response("Invalid key", { status: 400 });
        }
        const resumeKey = `resumes/${Date.now()}-${key}`;
        const signedUrl = await getR2SignedUploadUrl({key: resumeKey, contentType: type, expiresIn: 3600});

        return new Response(JSON.stringify({ signedUrl , key: resumeKey}), {
            headers: { "Content-Type": "application/json" },
        }); 
    } catch (error) {
        console.error("Error processing resume upload:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
 }