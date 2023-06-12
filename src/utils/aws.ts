import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3client: S3Client;
export const getS3Client = () => {
  if (s3client) return s3client;
  s3client = new S3Client({ region: "ap-southeast-1" });
  return s3client;
};

// bucket's name 'manage-documents.anypay.co.th'
// presigned url expired in 3600

const bucketName = "manage-documents.anypay.co.th";
const expiredIn = 3600;
export const requestPresignedURL = (s3Client: S3Client, path: string) => {
  console.log("s3client", s3Client);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: path,
  });
  return getSignedUrl(s3Client, command, {
    expiresIn: expiredIn,
  });
};
