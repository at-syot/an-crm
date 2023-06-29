import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";

import * as db from "../database";
import {
  deleteTicketFlow,
  isDeleteTicketFlowArgs,
} from "../flows/deleteTicket";
import type { FlowDeleteTicketDeps } from "../flows/deleteTicket";
import * as repos from "../repositories/tickets";
import { fromTicketWithImageDAO_to_FlowDTO } from "../transformers";
import { isFlowFailResponse } from "../flows";

export const deleteTicket = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("req.body", req.body);
  // validation
  const { error } = schema.validate(req.body);
  if (error || !isDeleteTicketFlowArgs(req.body)) {
    console.log("validation error", error);
    return res.status(422).json(null);
  }

  const pool = db.getDB();
  const conn = await pool.getConnection();
  conn.beginTransaction();
  try {
    const flowArgs = req.body;
    const flowDeps = {
      deleteTicket: repos.deleteTicket,
      getTicket: repos.getTicketWithImagesById,
      toResponse: fromTicketWithImageDAO_to_FlowDTO,
    } satisfies FlowDeleteTicketDeps;
    const response = await deleteTicketFlow(conn, flowArgs, flowDeps);

    if (isFlowFailResponse(response)) {
      conn.rollback();
      const { status, errors } = response;
      return res.status(status).json({ errors });
    }

    conn.commit();
    return res.json(response);
  } catch (err) {
    conn.rollback();
  }
};

const schema = joi.object({
  id: joi.string().required(),
  userId: joi.string().required(),
});
