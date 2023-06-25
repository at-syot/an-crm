import { NextApiRequest, NextApiResponse } from "next";

import * as db from "../database";
import * as ticketsRepo from "../repositories/tickets";
import * as transformers from "../transformers";
import { getTicketsFlow } from "../flows/getTickets";
import type { FlowGetTicketsDeps } from "../flows/getTickets";

export const getAllTicketsWithImagesHander = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const pool = db.getDB();
    const conn = await pool.getConnection();

    const flowDeps = {
      getAllTicketsWithImage: ticketsRepo.getAllTicketsWithImage,
      toResponse: transformers.fromAllTicketsWithImageDAO_to_dto,
    } satisfies FlowGetTicketsDeps;
    const data = await getTicketsFlow(conn, flowDeps);
    return res.json(data);
  } catch (err) {
    console.log("get all tickets with images error", err);
    return res.status(500).json({ errors: [] });
  }
};
