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
type VerifyAdminRoleAccessTokenFn = (req: NextApiRequest) => Promise<
  | {
      valid: true;
      username: string;
      role: UserRole;
    }
  | { valid: false }
>;
export const verifyAdminRoleAccessToken: VerifyAdminRoleAccessTokenFn = async (
  req
) => {
  const header = req.headers["authentication"] as string;
  const splitted = header.split(" ");
  const [, accessToken] = splitted;

  const decoded = encryptionUtils.verifyJWT(accessToken);
  if (!decoded) {
    return { valid: false };
  }

  const { username } = decoded;
  const conn = await db.getDB().getConnection();
  const user = await userRepo.getUserByUsername(conn, username);
  if (!user || user.role == "client") {
    return { valid: false };
  }

  const { role } = user;
  return { username, role, valid: true };
};
