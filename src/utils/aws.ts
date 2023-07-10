import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import type { Files, File } from "formidable";

let s3client: S3Client;
export const getS3Client = () => {
  if (s3client) return s3client;
  const region = process.env.AWS_REION;
  s3client = new S3Client({ region });
  return s3client;
};

const bucketName = String(process.env.AWS_S3_BUCKET);
const expiredIn = parseInt(process.env.AWS_S3_PRESIGNED_EXPIRE_DURATION ?? "");
export const requestPresignedURL = (s3Client: S3Client, path: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: path,
  });
  return getSignedUrl(s3Client, command, {
    expiresIn: expiredIn,
  });
};

export const removeBucketNameFromURI = (uri: string) => {
  if (!uri.includes(`s3://${bucketName}`)) return uri;

  const bucketPath = uri.split("//").slice(1)[0];
  const path = bucketPath.split("/").slice(1).join("/");
  return path;
};

export const requestShareablePresignedURL = (
  s3Client: S3Client,
  path: string
) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: path,
  });
  return getSignedUrl(s3Client, command, {
    expiresIn: expiredIn,
  });
};

export const uploadFilesToS3 = async (files: Files, s3Dir: string) => {
  const uploads = Object.entries(files).map(async ([key, _image]) => {
    const image = _image as File;
    const s3FilePath = generateS3FilePath(image, s3Dir);
    await uploadToS3(image.filepath, s3FilePath);
    await deleteTempFile(image);
    return `s3://${bucketName}/${s3FilePath}`;
  });

  return await Promise.all(uploads);
};

export type DeleteFileInS3Fn = (
  path: string
) => ReturnType<typeof deleteFileInS3>;
export const deleteFileInS3 = (path: string) => {
  const client = getS3Client();
  const keyPath = removeBucketNameFromURI(path);
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: keyPath,
  });
  return client.send(command);
};

// ------------ internal ------------
const extractFileExt = (file: File) =>
  file.mimetype
    ? (() => {
        const splited = file.mimetype.split("/");
        return splited[splited.length - 1];
      })()
    : "png";

const generateS3FilePath = (file: File, s3Dir: string) =>
  path.join(s3Dir, file.originalFilename ?? "");

const uploadToS3 = async (localFilePath: string, toS3Path: string) => {
  const client = getS3Client();
  const fileStream = fs.createReadStream(localFilePath);
  const command = new PutObjectCommand({
    Body: fileStream,
    Bucket: bucketName,
    Key: toS3Path,
  });
  await client.send(command);
};

const deleteTempFile = (file: File) => fs.promises.rm(file.filepath);
