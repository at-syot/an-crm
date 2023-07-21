import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../../src/api/handlers";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return handlers.deleteUserById(req, res);
  }
};
