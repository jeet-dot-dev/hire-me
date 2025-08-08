import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {r2} from "./r2Client";



type GetUploadUrlOptions = {
  key: string; 
  expiresIn?: number; // seconds (default 300s = 5 min)
  contentType?: string;
};

export async function getR2SignedUploadUrl({key,expiresIn = 300,contentType}:GetUploadUrlOptions) {
  console.log(process.env.R2_BUCKET_NAME, "R2 Bucket Name");

 try{
    const command = new PutObjectCommand({
        Bucket : process.env.R2_BUCKET_NAME!,
        Key:key,
        ContentType:contentType
    })

    const signedurl = await getSignedUrl(r2,command,{expiresIn});
    return signedurl ;
 }catch (error) {
    console.error("Error getting signed upload URL:", error);
    throw error;
  }
}