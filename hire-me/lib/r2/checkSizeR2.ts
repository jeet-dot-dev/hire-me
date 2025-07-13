import { r2 } from "./r2Client";
import { HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const MAX_IMAGE = 1 * 1024 * 1024; //1MB
const MAX_PDF = 5 * 1024 * 1024; // 5MB

/** HEAD the object → reject & delete if oversize */
export async function assertSizeOrDelete(key: string) {
  const { ContentLength = 0 } = await r2.send(
    new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })
  );
  console.log("ContentLength", ContentLength);
  const isPdf = /\.pdf/i.test(key);
  const limit = isPdf ? MAX_PDF : MAX_IMAGE;

  if (ContentLength > limit) {
    try {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
        })
      );
      throw new Error(
        `${isPdf ? "Resume" : "Profile photo"} exceeds ${
          limit / 1024 / 1024
        } MB`
      );
    } catch (error) {
      console.log(error);
      throw new Error("Something wrong ! ");
    }
  }
}
