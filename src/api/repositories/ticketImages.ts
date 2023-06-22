import type { PoolConnection } from "mysql2/promise";
import type { Files } from "formidable";
import path from "path";

import * as awsUtils from "../../utils/aws";

export type CreateTicketImagesFn = (
  conn: PoolConnection,
  ticketId: string,
  uris: string[]
) => Promise<void>;
export const createTicketImages: CreateTicketImagesFn = async (
  conn,
  ticketId,
  uris
) => {
  const createTicketImage = (uri: string) => {
    const sql = `
      INSERT INTO ticket_images (
        ticketId,
        uri,
        cAt
      ) VALUES (?, ?, ?)`;
    const values = [ticketId, uri, new Date()];
    return conn.execute(sql, values);
  };

  await Promise.all(uris.map(createTicketImage));
};

export type UploadTicketImagesToS3Fn = (
  ticketId: string,
  images: Files
) => Promise<string[]>;
export const uploadTicketImagesToS3: UploadTicketImagesToS3Fn = (
  ticketId,
  images
) => {
  const rootFolder = "anypay-crm";
  const ticketFolder = `tickets/${ticketId}`;
  const ticketImagesFolderPath = path.join(rootFolder, ticketFolder, "images");
  return awsUtils.uploadFilesToS3(images, ticketImagesFolderPath);
};
