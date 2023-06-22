import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../src/api/handlers";

export const config = {
  api: { bodyParser: false },
};

export default async function ticket(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    return handlers.createTicketHandler(req, res);
  }
}
