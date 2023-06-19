import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/database";
import * as reqUtils from "../../../src/utils/request";
import type { File, Files } from "formidable";
import path from "path";
import * as fs from "fs";
import * as aws from "../../../src/utils/aws";
import joi from "joi";
import { v4 } from "uuid";

const schema = joi
  .object({
    ticketName: joi.string().required(),
    // merchantName: joi.string().required(),
    issueId: joi.string().required(),
    detail: joi.string().allow("").required(),
  })
  .allow();

export const config = {
  api: { bodyParser: false },
};

export default async function ticket(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    return createTicket(req, res);
  }
}

type HandlerFn = (req: NextApiRequest, res: NextApiResponse) => void;
const createTicket: HandlerFn = async (req, res) => {
  try {
    // usecase
    // - validate required fields [DONE]
    // - create ticket [DONE]
    // - create ticket_logs record [DONE]
    // - upload attached files
    // - update created tocket images

    // validate fields
    const { fields, files } = await reqUtils.parseFormData(req);
    const { error } = schema.validate(fields);
    if (error) {
      console.log("error", error);
      return res.status(422).json(null);
    }

    // ---- get presignedURL from aws testing
    const presignedURLs = uploadFilesToS3(files);
    return res.json({ message: "upload success", urls: presignedURLs });

    const { issueId, detail, ticketName } = fields;

    // create ticket
    const ticketId = v4();
    const saveTicketSQL = `
      INSERT INTO tickets (
        id,
        name, 
        detail, 
        issueTopicId,
        currentStatus,
        cAt,
        uAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const saveTicketSQLValues = [
      ticketId,
      ticketName,
      detail,
      issueId,
      "new",
      new Date(),
      new Date(),
    ];

    // create ticket log record
    const ticketRecordSQL = `
      INSERT INTO ticket_logs (status, cAt, ticketId) VALUES (?, ?, ?)`;
    const ticketRecordSQLValues = ["new", new Date(), ticketId];

    // get latest saved ticket record sql
    const selectSavedTicketSQL = `
      SELECT * FROM tickets
      WHERE id = ? LIMIT 1`;
    const selectSavedTicketSQLValues = [ticketId];

    // start transaction's process
    const pool = db.getDB();
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    await conn.execute(saveTicketSQL, saveTicketSQLValues);
    await conn.execute(ticketRecordSQL, ticketRecordSQLValues);
    await conn.commit();

    const [indbTicket] = await conn.query(
      selectSavedTicketSQL,
      selectSavedTicketSQLValues
    );

    return res
      .status(200)
      .json({ message: "create ticket sucess", data: indbTicket });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send("");
  }
};

const uploadFilesToS3 = (files: Files) => {
  const presignedURLs: string[] = [];
  Object.entries(files).forEach(async ([imageKeyName, image]) => {
    const usableImage = image as File;
    console.log("usableImage", usableImage);

    const { mimetype, originalFilename, filepath } = usableImage;

    // get extension
    let ext = "png";
    if (mimetype) {
      const splited = mimetype.split("/");
      ext = splited[splited.length - 1];
    }

    // presigned folder: anypay-crm/tickets/ticketid-[]/images/
    const apiUploadFolderPath = "anypay-crm";
    const ticketFolderPath = "tickets/ticketid-fakeid-1";

    // check ticket images folder exist
    const ticketImagesFolderPath = path.join(
      process.cwd(),
      apiUploadFolderPath,
      ticketFolderPath,
      "images"
    );

    // create ticket images folder if need
    if (!fs.existsSync(ticketImagesFolderPath)) {
      fs.mkdirSync(ticketImagesFolderPath, { recursive: true });
      console.log(`path: ${ticketImagesFolderPath} is created`);
    }

    // copy temp file to
    const toUploadImagePath = path.join(
      ticketImagesFolderPath,
      `${imageKeyName}.${ext}`
    );
    fs.copyFileSync(usableImage.filepath, toUploadImagePath);
    console.log(`copy src: ${usableImage.filepath} --> ${toUploadImagePath}`);

    const s3Client = aws.getS3Client();
    const url = await aws.requestPresignedURL(s3Client, toUploadImagePath);
    console.log(`generated presignedURL: ${url}`);
    presignedURLs.push(
      `toUploadImagePath: ${toUploadImagePath} -- presignedURL: ${url}`
    );
  });

  return presignedURLs;
};
