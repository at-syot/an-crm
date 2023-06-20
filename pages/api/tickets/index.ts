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
    const presignedURLs = await uploadTicketImagesToS3("fake-ticketid", files);
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

const uploadTicketImagesToS3 = (
  ticketId: string = "fake-ticketid",
  files: Files
) => {
  const rootFolder = "anypay-crm";
  const ticketFolder = `tickets/${ticketId}`;
  const ticketImagesFolderPath = path.join(rootFolder, ticketFolder, "images");
  return aws.uploadFilesToS3(files, rootFolder, ticketImagesFolderPath);
};
