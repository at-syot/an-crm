import { NextApiRequest, NextApiResponse } from "next";
import { unauthorized } from "./helpers/response";
import { verifyAdminRoleAccessToken } from "./helpers/verifyAdminRoleAccessToken";
import * as userRepo from "../repositories/users";
import * as db from "../database";

/**
 * --- handlers.adminToken
 * verify adminRole access token
 * retrive admin user data
 */
export async function adminToken(req: NextApiRequest, res: NextApiResponse) {
  const conn = await db.getDB().getConnection();

  try {
    const decoded = await verifyAdminRoleAccessToken(req);
    if (decoded.status == "inValid") {
      return unauthorized(res);
    }

    const { username } = decoded;
    const user = await userRepo.getUserByUsername(conn, username);

    return res.json({ message: "", data: user });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: "unknown error" }] });
  }
}
