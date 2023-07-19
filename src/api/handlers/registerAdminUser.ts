import { NextApiRequest, NextApiResponse } from "next";
import joi, { valid } from "joi";
import { verifyJWT, hashPlainPassword } from "../../utils/encryption";
import * as db from "../database";
import * as userRepo from "../repositories/users";
import { UserRole } from "../domains";
import { CreateAdminUserDAO } from "../daos";
import { hash } from "bcrypt";

const schema = joi.object({
  username: joi.string().required(),
  password: joi.string().min(6).required(),
  role: joi.string().required(),
});

/**
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
const verifyAdminRoleAccessToken: VerifyAdminRoleAccessTokenFn = async (
  req
) => {
  const header = req.headers["authentication"] as string;
  const splitted = header.split(" ");
  const [, accessToken] = splitted;

  const decoded = verifyJWT(accessToken);
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
