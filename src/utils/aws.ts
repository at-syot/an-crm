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
  console.log("s3 config", s3client.config);
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

export const uploadFilesToS3 = async (
  files: Files,
  rootPath: string,
  presignedFolderPath: string
) => {
  const constructedPresignedFolderPath =
    await createTempPresignedFolderPathIfNeed(presignedFolderPath);
  const uploads = Object.entries(files).map(async ([key, _image]) => {
    const image = _image as File;
    const { originalFilename, filepath } = image;
    const ext = extractFileExt(image);
    const uploadingImagePath = await buildUploadingImageTempPath(
      image,
      constructedPresignedFolderPath,
      key,
      ext
    );
    // const signedURL = await generatePresignedURL(uploadingImagePath);
    await uploadPresignedURLToS3(filepath, originalFilename ?? "");

    // await deleteUploadRootPath(rootPath);
  });

  await Promise.all(uploads);
};

// ------------ internal ------------
const createTempPresignedFolderPathIfNeed = async (
  presignedFolderPath: string
) => {
  if (!fs.existsSync(presignedFolderPath)) {
    await fs.promises.mkdir(presignedFolderPath, { recursive: true });
  }
  return presignedFolderPath;
};

const extractFileExt = (file: File) =>
  file.mimetype
    ? (() => {
        const splited = file.mimetype.split("/");
        return splited[splited.length - 1];
      })()
    : "png";

const buildUploadingImageTempPath = async (
  file: File,
  srcPath: string,
  fileName: string,
  ext: string
) => {
  const uploadingImagePath = path.join(srcPath, `${fileName}.${ext}`);
  await fs.promises.copyFile(file.filepath, uploadingImagePath);
  return uploadingImagePath;
};

const uploadPresignedURLToS3 = async (
  localFilePath: string,
  toS3Path: string
) => {
  const client = getS3Client();
  console.log("localFilePath", localFilePath);
  console.log("toS3Path", toS3Path);
  const command = new PutObjectCommand({
    Body: localFilePath,
    Bucket: bucketName,
    Key: toS3Path,
    ContentEncoding: "gzip, deflate",
  });
  const response = await client.send(command);
  console.log("uploading response", response);
};

const deleteUploadRootPath = (path: string) =>
  fs.promises.rm(path, { recursive: true, force: true });
