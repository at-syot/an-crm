import type { NextApiRequest, NextApiResponse } from "next";
import * as userRepo from "../repositories/users";
import * as db from "../database";
import {
  isVerifyTokenFail,
  verifyAdminRoleAccessToken,
} from "./helpers/verifyAdminRoleAccessToken";

/**
 * --- getUserById
 */
export const getUserById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const conn = await db.getDB().getConnection();

  try {
    const decoded = await verifyAdminRoleAccessToken(req);
    if (isVerifyTokenFail(decoded)) {
      return res.status(401).json({ errors: [{ message: "unauthorized" }] });
    }

    const { userId } = req.query;
    const user = await userRepo.getUserById(conn, String(userId));
    if (!user) {
      return res.status(404).json({ errors: [{ message: "user not found" }] });
    }

    return res.json({ message: "", data: user });
  } catch (err) {
    return res.status(500).json({ message: "" });
  }
};
