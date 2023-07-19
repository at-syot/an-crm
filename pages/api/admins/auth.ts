import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import { validatePw, signJWT } from "../../../src/utils/encryption";
import * as db from "../../../src/api/database";
import * as userRepo from "../../../src/api/repositories/users";
import { CreateAdminUserDAO } from "../../../src/data.types";

// TODO: move mock system user to seed api
// TODO: move admin.auth to api/handlers
// TODO: move verifyAdminRoleAccessToken to saperated file.

const schema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ errors: [{ message: "invalid body" }] });
  }

  // - get users by username
  // - validate password
  // - check user role
  // - sign jwt
  // - return jwt as [accessToken: string]
  const pool = db.getDB();
  const conn = await pool.getConnection();
  const { username, password } = req.body;
  const indbUser = await userRepo.getUserByUsername(conn, String(username));
  if (!indbUser) {
    return res.status(404).json({ errors: [{ message: "user not found" }] });
  }

  const hashed = indbUser.password;
  const validPW = await validatePw(String(password), hashed);
  if (!validPW) {
    return res.status(401).json({ errors: [{ message: "unauthorized" }] });
  }

  const { role } = indbUser;
  if (role == "client") {
    return res.status(401).json({ errors: [{ message: "unauthorized" }] });
  }

  const accessToken = signJWT({ role, username });
  return res.json({
    message: "admin authentication successful",
    data: { accessToken },
  });
};
