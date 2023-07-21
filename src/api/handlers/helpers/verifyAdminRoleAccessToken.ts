import type { NextApiRequest, NextApiResponse } from "next";
import { UserRole } from "../../domains";
import * as encryptionUtils from "../../../utils/encryption";
import * as userRepo from "../../repositories/users";
import * as db from "../../database";

/**
 * get Bearer accessToken
 * verify & decode accessToken
 * verify username & role
 * pass user'data through header
 */
type VerifyStatus = "valid" | "inValid" | "expired";
export type VerifyTokenSuccess = {
  status: VerifyStatus;
  username: string;
  role: UserRole;
};
export type VerifyTokenFail = { status: VerifyStatus };
export type VerifyTokenResponse = VerifyTokenFail | VerifyTokenSuccess;
type VerifyAdminRoleAccessTokenFn = (
  req: NextApiRequest
) => Promise<VerifyTokenResponse>;

export const verifyAdminRoleAccessToken: VerifyAdminRoleAccessTokenFn = async (
  req
) => {
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

  const { role } = user;
  return { username, role, status: "valid" };
};

export function isVerifyTokenFail(
  res: VerifyTokenResponse
): res is VerifyTokenFail {
  return res.status !== "valid";
}
