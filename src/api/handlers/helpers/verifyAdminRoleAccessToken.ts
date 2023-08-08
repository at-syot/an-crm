import type { NextApiRequest, NextApiResponse } from "next";
import { UserRole } from "../../domains";
import * as encryptionUtils from "../../../utils/encryption";
import * as userRepo from "../../repositories/users";
import * as userSessionRepo from "../../repositories/userSessions";
import * as db from "../../database";

/**
 * get Bearer accessToken
 * verify & decode accessToken
 * verify username & role
 * verify userSession
 */
type VerifyTokenSuccess = {
  status: "valid";
  accessToken: string;
  username: string;
  role: UserRole;
};
type VerifyTokenFail = { status: "inValid" };
type VerifyTokenResponse = VerifyTokenFail | VerifyTokenSuccess;
type VerifyAdminRoleAccessTokenFn = (
  req: NextApiRequest
) => Promise<VerifyTokenResponse>;

export const verifyAdminRoleAccessToken: VerifyAdminRoleAccessTokenFn = async (
  req
) => {
  try {
    const header = req.headers["authentication"] as string;
    const splitted = header.split(" ");
    const [, accessToken] = splitted;

    const decoded = encryptionUtils.verifyJWT(accessToken);
    if (!decoded) {
      return { status: "inValid" };
    }

    const { username } = decoded;
    const conn = await db.getDB().getConnection();
    const user = await userRepo.getUserByUsername(conn, username);
    if (!user || user.role == "client") {
      return { status: "inValid" };
    }

    const userSessions = await userSessionRepo.findUserSessionBy(conn, user.id);
    if (userSessions.length == 0) {
      return { status: "inValid" };
    }

    const { role } = user;
    return { username, role, status: "valid", accessToken };
  } catch (err) {
    return { status: "inValid" };
  }
};
