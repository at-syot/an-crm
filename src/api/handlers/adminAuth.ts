import { NextApiRequest, NextApiResponse } from "next";

import * as db from "../database";
import * as userRepo from "../repositories/users";
import * as encryptionUtils from "../../utils/encryption";
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
 * @returns jwt as [accessToken: string]
 */
export const adminAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const pool = db.getDB();
  const conn = await pool.getConnection();

  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ errors: [{ message: "invalid body" }] });
    }

    const { username, password } = req.body;
    const indbUser = await userRepo.getUserByUsername(conn, String(username));
    if (!indbUser) {
      return res.status(404).json({ errors: [{ message: "user not found" }] });
    }

    const hashed = indbUser.password;
    const validPW = await encryptionUtils.validatePw(String(password), hashed);
    if (!validPW) {
      return res.status(401).json({ errors: [{ message: "unauthorized" }] });
    }

    const { role } = indbUser;
    if (role == "client") {
      return res.status(401).json({ errors: [{ message: "unauthorized" }] });
    }

    const accessToken = encryptionUtils.signJWT({ role, username });
    return res.json({
      message: "admin authentication successful",
      data: { accessToken },
    });
  } catch (err) {
    console.log("api.handlers.adminAuth err ", err);
    return res.status(500).json({ errors: [] });
  }
};
