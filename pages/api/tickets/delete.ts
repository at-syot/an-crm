// Regarding to NextJs v13.x.x have a bug that can't handle DELETE http-method
// -> https://github.com/vercel/next.js/discussions/48072
// -> https://github.com/vercel/next.js/issues/49353

import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../src/api/handlers";

export const config = {
  api: { bodyParser: true },
};

export default async function deleteTicket(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return handlers.deleteTicket(req, res);
  }
}
