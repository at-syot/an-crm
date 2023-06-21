import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetch from "node-fetch";
import axios from "axios";
import fs from "fs";
import path from "path";
import type { Files, File } from "formidable";

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
  const command = new PutObjectCommand({
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
    await uploadToS3(image.filepath, generateS3FilePath(image, s3Dir));
    await deleteTempFile(image);
  });

  await Promise.all(uploads);
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
  const response = await client.send(command);
  console.log("resp", response);
};

const deleteTempFile = (file: File) => fs.promises.rm(file.filepath);
