import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../../src/api/handlers";

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log("/users/userId");
  if (req.method === "GET") {
    return handlers.getUserById(req, res);
  }
};
