import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../../../src/api/handlers";

export const config = {
  api: { bodyParser: false },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    return handlers.createTicketImage(req, res);
  }
};
