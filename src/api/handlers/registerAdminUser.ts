import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import { hashPlainPassword } from "../../utils/encryption";
import * as db from "../database";
import * as userRepo from "../repositories/users";
import { CreateAdminUserDAO } from "../daos";
import { verifyAdminRoleAccessToken } from "./helpers/verifyAdminRoleAccessToken";

const schema = joi.object({
  username: joi.string().required(),
  password: joi.string().min(6).required(),
  role: joi.string().required(),
});

/**
 * --- handlers.registerAdminUser
 *
 * verify req.body
 * check user existing by username
 * hash user.password
 * create user
 */
export const registerAdminUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const conn = await db.getDB().getConnection();
  await conn.beginTransaction();

  try {
    const decoded = await verifyAdminRoleAccessToken(req);
    const { valid } = decoded;
    if (!valid) {
      return res.status(401).json({ errors: [{ message: "unauthorized" }] });
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(422)
        .json({ errors: [{ message: "unprocessable entity" }] });
    }

    const { username: cBy } = decoded;
    const { password, role, username } = req.body;

    const existingUser = await userRepo.getUserByUsername(conn, username);
    if (existingUser) {
      return res
        .status(409)
        .json({ errors: [{ message: "the user is already exist" }] });
    }

    const hashed = await hashPlainPassword(password);
    const indbUser = await userRepo.createAdminUser(conn, {
      username: String(username),
      password: hashed,
      role: role,
      cBy,
    } satisfies CreateAdminUserDAO);
    await conn.commit();

    return res.json({
      message: "regist new admin user success.",
      data: indbUser,
    });
  } catch (err) {
    await conn.rollback();
    return res
      .status(500)
      .json({ errors: [{ message: "internal server error" }] });
  }
};
