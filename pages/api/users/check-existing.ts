import type { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../src/api/handlers";

export default async function checkLineUserExist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return handlers.checkUserExisting(req, res);
}
