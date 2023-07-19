import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import { validatePw, signJWT } from "../../../src/utils/encryption";
import * as db from "../../../src/api/database";
import * as userRepo from "../../../src/api/repositories/users";
import { CreateAdminUserDAO } from "../../../src/data.types";

// import {} from 'jws'

const schema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // // mock system user --> [DONE]
  // const username = "system-user";
  // const password = "sysuser4321";
  // const hashed = await hashPlainPassword(password);

  // const pool = db.getDB();
  // const conn = await pool.getConnection();

  // const input = {
  //   username,
  //   password: hashed,
  //   role: "system",
  //   cBy: "system",
  // } satisfies CreateAdminUserDAO;
  // const indbUser = await userRepo.createAdminUser(conn, input);

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
