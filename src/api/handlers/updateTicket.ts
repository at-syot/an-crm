import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";

import * as db from "../database";
import { FlowUpdateTicketDeps, updateTicketFlow } from "../flows/updateTicket";
import { isFlowFailResponse } from "../flows";
import { FlowUpdateTicketDTO } from "../dtos";
import * as ticketRepo from "../repositories/tickets";

const schema = joi.object({
  name: joi.string().required(),
  issueTopicId: joi.string().required(),
  detail: joi.string().required(),
});

export const updateTicketById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { ticketId } = req.query;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ errors: [{ message: "invalid body" }] });
  }

  const pool = db.getDB();
  const conn = await pool.getConnection();
  conn.beginTransaction();

  const { name, issueTopicId, detail } = req.body;
  const flowArgs = {
    id: String(ticketId),
    name: String(name),
    issueTopicId: String(issueTopicId),
    detail: String(detail),
  } satisfies FlowUpdateTicketDTO;
  const flowDeps = {
    updateTicketById: ticketRepo.updateTicketById,
  } satisfies FlowUpdateTicketDeps;
  const response = await updateTicketFlow(conn, flowArgs, flowDeps);
  if (isFlowFailResponse(response)) {
    await conn.rollback();

    const { status, errors } = response;
    return res.status(status).json({ errors });
  }

  await conn.commit();
  return res.json(response);
};
