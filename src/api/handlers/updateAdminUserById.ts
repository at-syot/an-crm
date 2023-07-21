import type { NextApiRequest, NextApiResponse } from "next";
import {
  isVerifyTokenFail,
  verifyAdminRoleAccessToken,
} from "./helpers/verifyAdminRoleAccessToken";
import * as db from "../database";
import * as userRepo from "../repositories/users";
import joi from "joi";
import * as encryptionUtils from "../../utils/encryption";
import { UpdateAdminUserDAO } from "../daos";

/**
 * --- updateAdminUserById
 *
 * @body { username, password, role }
 *
 * verify & decode accessToken
 * validate req.body
 * check existing
 * check duplicate username
 * hash password
 * update adminUser
 */
const schema = joi.object({
  username: joi.string().required(),
  password: joi.string().min(6).required(),
  role: joi.string().required(),
});
export const updateAdminUserById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const conn = await db.getDB().getConnection();
  await conn.beginTransaction();
  try {
    const decoded = await verifyAdminRoleAccessToken(req);
    if (isVerifyTokenFail(decoded)) {
      return res.status(401).json({ errors: [{ message: "unauthorized" }] });
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(422)
        .json({ errors: [{ message: "unprocessable entity" }] });
    }

    const { username: uBy } = decoded;
    const { id: userId } = req.query;
    const { username, password, role } = req.body;

    const found = await userRepo.getUserById(conn, String(userId));
    if (!found) {
      return res.status(404).json({ errors: [{ message: "user not found" }] });
    }

    const duplicating = await userRepo.getUserByUsername(conn, username);
    if (duplicating) {
      return res
        .status(409)
        .json({ errors: [{ message: "duplicate username" }] });
    }

    const hashed = await encryptionUtils.hashPlainPassword(password);
    const updatedUser = await userRepo.updateAdminUser(conn, {
      id: String(userId),
      username: String(username),
      password: hashed,
      role,
      uBy,
    } satisfies UpdateAdminUserDAO);
    await conn.commit();

    return res.json({
      message: "update admin by id success",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    await conn.rollback();
    return res.status(500).json({ errors: [] });
  }
};
