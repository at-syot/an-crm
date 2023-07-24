import { NextApiRequest, NextApiResponse } from "next";

import * as db from "../database";
import * as userRepo from "../repositories/users";
import * as userSessioinRepo from "../repositories/userSessions";
import * as encryptionUtils from "../../utils/encryption";
import * as responseHelper from "./helpers/response";
import joi from "joi";

const schema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});
/**
 * get users by username
 * validate password
 * check user role
 * sign jwt
 * create user session record
 *   - jwt, userId, cAt
 *
 * @returns jwt as [accessToken: string]
 */
export const adminAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const pool = db.getDB();
  const conn = await pool.getConnection();

  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return responseHelper.unProcessableEntity(res);
    }

    const { username, password } = req.body;
    const indbUser = await userRepo.getUserByUsername(conn, String(username));
    if (!indbUser) {
      return responseHelper.resourceNotFound(res);
    }

    const hashed = indbUser.password;
    const validPW = await encryptionUtils.validatePw(String(password), hashed);
    if (!validPW) {
      return responseHelper.unProcessableEntity(res);
    }

    const { role } = indbUser;
    if (role == "client") {
      return responseHelper.unProcessableEntity(res);
    }

    const accessToken = encryptionUtils.signJWT({ role, username });
    const { id: userId } = indbUser;
    await userSessioinRepo.createUserSession(conn, {
      userId,
      token: accessToken,
    });
    await conn.commit();

    return res.json({
      message: "admin authentication successful",
      data: { accessToken },
    });
  } catch (err) {
    console.log("api.handlers.adminAuth err ", err);
    return res.status(500).json({ errors: [] });
  }
};
