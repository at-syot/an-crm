import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import type { Files, File } from "formidable";
import { build } from "joi";

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

export const uploadFilesToS3 = async (
  files: Files,
  presignedFolderPath: string
) => {
  const constructedPresignedFolderPath =
    await createTempPresignedFolderPathIfNeed(presignedFolderPath);
  const uploads = Object.entries(files).map(async ([key, _image]) => {
    const image = _image as File;
    const ext = extractFileExt(image);
    const uploadingImagePath = await buildUploadingImageTempPath(
      image,
      constructedPresignedFolderPath,
      key,
      ext
    );
    const signedURL = await generatePresignedURL(uploadingImagePath);
    // await deleteUploadingImageTempPath(uploadingImagePath);

    return signedURL;
  });
  return Promise.all(uploads);
};

// ------------ internal ------------
const createTempPresignedFolderPathIfNeed = async (
  presignedFolderPath: string
) => {
  if (!fs.existsSync(presignedFolderPath)) {
    await fs.promises.mkdir(presignedFolderPath);
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

const generatePresignedURL = (path: string) => {
  const client = getS3Client();
  return requestPresignedURL(client, path);
};

const deleteUploadingImageTempPath = (path: string) => fs.promises.unlink(path);
