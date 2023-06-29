import { NextApiRequest, NextApiResponse } from "next";
import {
  FlowDeleteTicketImageDeps,
  deleteTicketImageFlow,
} from "../flows/deleteTicketImage";
import * as db from "../database";
import type { FlowDeleteTicketImageDTO } from "../dtos";
import * as ticketImageRepo from "../repositories/ticketImages";
import * as awsUtils from "../../utils/aws";

import joi from "joi";

const schema = joi.object({
  id: joi.string().required(),
  uri: joi.string().required(),
});

export const deleteTicketImage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { ticketId } = req.query;
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(422).json({ errors: [] });
  }

  const pool = db.getDB();
  const conn = await pool.getConnection();
  conn.beginTransaction();

  try {
    const { id, uri } = req.body;
    const flowArgs = {
      ticketId: String(ticketId),
      id: String(id),
      uri: String(uri),
    } satisfies FlowDeleteTicketImageDTO;
    const flowDeps = {
      deleteTicketImage: ticketImageRepo.deleteTicketImage,
      deleteS3File: awsUtils.deleteFileInS3,
    } satisfies FlowDeleteTicketImageDeps;
    await deleteTicketImageFlow(conn, flowArgs, flowDeps);
    await conn.commit();

    return res.json({
      message: `delete ticket's image by given id successful`,
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
    return res.status(500).json({ errors: [] });
  }
};
