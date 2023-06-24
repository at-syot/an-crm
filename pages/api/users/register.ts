import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../src/api/handlers";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return handlers.registerUser(req, res);
}
