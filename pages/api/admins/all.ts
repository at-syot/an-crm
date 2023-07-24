import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../src/api/handlers";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return handlers.getAdminUsers(req, res);
  }
  return res.status(400).json(undefined);
};
