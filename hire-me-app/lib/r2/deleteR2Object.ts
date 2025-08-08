import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2Client";

export const deleteR2Object = async (keys: string[]) => {
  try {
    await Promise.all(
      keys.map((key) =>
        r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          })
        )
      )
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteR2ObjectSingle = async (key: string) => {
  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
    })
  );
  return true;
} catch (error) {
  console.log(error);
  return false;
}
}
