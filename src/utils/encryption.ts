import * as jwt from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";
import type { UserRole } from "../data.types";

const jwtSecret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRESIN;
const saltRound = 10;

export const hashPlainPassword = async (plainPW: string) => {
  const salt = await genSalt(saltRound);
  return await hash(plainPW, salt);
};

export const validatePw = (password: string, hashed: string) =>
  compare(password, hashed);

export type JWTPayload = { role: UserRole; username: string };
export const signJWT = (payload: JWTPayload) => {
  return jwt.sign(payload, jwtSecret ?? "", { expiresIn });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, jwtSecret ?? "");
    return decoded as jwt.JwtPayload & { username: string; role: string };
  } catch (err) {
    return null;
  }
};
