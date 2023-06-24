import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";

import * as db from "../database";
import * as reqUtils from "../../utils/request";
import * as ticketsRepo from "../repositories/tickets";
import * as ticketLogRepo from "../repositories/ticketLog";
import * as ticketImageRepo from "../repositories/ticketImages";
import * as transformers from "../transformers";
import { createTicketFlow } from "../flows";
import type { FlowCreateTicketDeps } from "../flows";
import type { FlowCreateTicketDTO } from "../dtos";

const schema = joi
  .object({
    ticketName: joi.string().required(),
    // merchantName: joi.string().required(),
    issueId: joi.string().required(),
    detail: joi.string().allow("").required(),
  })
  .allow();

type HandlerFn = (req: NextApiRequest, res: NextApiResponse) => void;

export const createTicketHandler: HandlerFn = async (req, res) => {
  const { fields, files } = await reqUtils.parseFormData(req);
  const { error } = schema.validate(fields);
  if (error) {
    console.log("validation error", error);
    return res.status(422).json(null);
  }

  const pool = db.getDB();
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const flowArgs = {
      ticketName: String(fields.ticketName),
      issueId: String(fields.issueId),
      detail: String(fields.detail),
      images: files,
    } satisfies FlowCreateTicketDTO;
    const flowDeps = {
      createTicket: ticketsRepo.createTicket,
      createTicketLog: ticketLogRepo.createTicketLog,
      uploadTicketImagesToS3: ticketImageRepo.uploadTicketImagesToS3,
      createTicketImages: ticketImageRepo.createTicketImages,
      getTicketWithImages: ticketsRepo.getTicketWithImagesById,
      toResponse: transformers.fromTicketWithImageDAO_to_FlowDTO,
    } satisfies FlowCreateTicketDeps;
    const flowResponse = await createTicketFlow(conn, flowArgs, flowDeps);
    await conn.commit();

    return res.json({ message: "create ticket success", data: flowResponse });
  } catch (err) {
    console.log("flow err", err);
    await conn.rollback();
    return res.status(500).json(null);
  }
};
