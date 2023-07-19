import { NextApiRequest, NextApiResponse } from "next";
import * as handlers from "../../../src/api/handlers";

// TODO: move mock system user to seed api [DONE]
// TODO: move admin.auth to api/handlers
// TODO: move verifyAdminRoleAccessToken to saperated file.

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    return handlers.adminAuth(req, res);
  }
};
