import { NextApiRequest, NextApiResponse } from "next";
import {
  verifyAdminRoleAccessToken,
  isVerifyTokenFail,
} from "./helpers/verifyAdminRoleAccessToken";
import { unauthorized, resourceNotFound } from "./helpers/response";
import type { VerifyTokenSuccess } from "./helpers/verifyAdminRoleAccessToken";
import * as db from "../database";
import * as userSessionRepo from "../repositories/userSessions";
import * as userRepo from "../repositories/users";

export const adminLogout = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const conn = await db.getDB().getConnection();
  try {
    const decoded = await verifyAdminRoleAccessToken(req);
    if (isVerifyTokenFail(decoded)) {
      return unauthorized(res);
    }

    const { username } = decoded as VerifyTokenSuccess;
    const indbUser = await userRepo.getUserByUsername(conn, username);
    if (!indbUser) {
      return resourceNotFound(res);
    }

    const { id } = indbUser;
    await userSessionRepo.revokeUserSession(conn, id);
    await conn.commit();

    return res.json({ message: "logout success" });
  } catch (err) {
    console.log("err", err);
    await conn.rollback();
    return res.status(500).json({ errors: [{ message: "unknown error" }] });
  }
};
