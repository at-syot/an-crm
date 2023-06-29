import { NextApiRequest, NextApiResponse } from "next";
import { parseFormData } from "../../utils/request";

import * as db from "../database";
import * as ticketImagesRepo from "../repositories/ticketImages";

export const createTicketImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { fields, files } = await parseFormData(req);
  if (!fields || !fields.ticketId || !files.image) {
    return res.status(422).json({ errors: [] });
  }

  const pool = db.getDB();
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    const ticketId = String(fields.ticketId);
    const uris = await ticketImagesRepo.uploadTicketImagesToS3(ticketId, files);
    await ticketImagesRepo.createTicketImages(conn, ticketId, uris);
    await conn.commit();

    return res.json({ message: "create ticket image" });
  } catch (err) {
    await conn.rollback();
    console.log("create ticket image err", err);
    return res.status(500).json({ errors: [] });
  }
};
