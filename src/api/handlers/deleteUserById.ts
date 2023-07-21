import { NextApiRequest, NextApiResponse } from "next";
import {
  verifyAdminRoleAccessToken,
  isVerifyTokenFail,
} from "./helpers/verifyAdminRoleAccessToken";
import type { VerifyTokenSuccess } from "./helpers/verifyAdminRoleAccessToken";
import * as userRepo from "../repositories/users";
import * as db from "../database";

/**
 * --- deleteUserById
 *
 * verify & decode accessToken
 * check user exist
 *
 */
export const deleteUserById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const conn = await db.getDB().getConnection();
  try {
    const decoded = await verifyAdminRoleAccessToken(req);
    if (!isVerifyTokenFail(decoded)) {
      res.status(401).json({ errors: [{ message: "unauthorized" }] });
    }

    const { username: dBy } = decoded as VerifyTokenSuccess;
    const { userId } = req.query;
    await userRepo.deleteUserById(conn, { id: String(userId), dBy });
    await conn.commit();

    return res.json({ message: "delete user by id success." });
  } catch (err) {
    console.log("api.handlers.deleteUserById err", err);

    await conn.rollback();
    return res.status(500).json({ errors: [] });
  }
};
