import { NextApiRequest, NextApiResponse } from "next";
import {
  isVerifyTokenFail,
  verifyAdminRoleAccessToken,
} from "./helpers/verifyAdminRoleAccessToken";
import * as response from "./helpers/response";
import type { VerifyTokenSuccess } from "./helpers/verifyAdminRoleAccessToken";
import * as db from "../database";
import * as userRepo from "../repositories/users";

export const getAdminUsers = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const decoded = await verifyAdminRoleAccessToken(req);
  if (isVerifyTokenFail(decoded)) {
    return response.unauthorized(res);
  }
  const { role } = decoded as VerifyTokenSuccess;
  if (role == "client") {
    return response.unauthorized(res);
  }

  try {
    const conn = await db.getDB().getConnection();
    const admins = await userRepo.getAdminUsers(conn, role);

    return res.json({ message: "", data: admins });
  } catch (err) {
    return res
      .status(500)
      .json({ errors: [{ message: catchErrorMessage(err) }] });
  }
};

function catchErrorMessage(err: unknown) {
  if (err instanceof Error) {
    return (err as Error).message;
  }
  return "unknown error";
}
