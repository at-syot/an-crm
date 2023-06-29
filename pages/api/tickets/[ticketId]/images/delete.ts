import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../../../src/api/handlers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    return handlers.deleteTicketImage(req, res);
  }
};
