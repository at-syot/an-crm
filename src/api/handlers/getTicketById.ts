import { NextApiRequest, NextApiResponse } from "next";
import * as ticketRepo from "../repositories/tickets";
import * as db from "../database";
import { fromTicketWithImageDAO_to_FlowDTO } from "../transformers";

export const getTicketById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { ticketId } = req.query;

  const pool = db.getDB();
  const conn = await pool.getConnection();
  const ticket = await ticketRepo.getTicketWithImagesById(
    conn,
    String(ticketId)
  );

  // check empty ticket
  if (Object.keys(ticket).length == 0) {
    return res
      .status(404)
      .json({ errors: [{ message: "can't find ticket id" }] });
  }

  const data = await fromTicketWithImageDAO_to_FlowDTO(ticket);
  return res.json({ message: "get ticket by id", data });
};
