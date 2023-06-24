import type { PoolConnection } from "mysql2/promise";
import type { FlowResponse } from "./types";
import type { GetUserByEmailAndPhoneNoFn } from "../repositories/users.apianypay";
import type { CreateUserFn, GetUserByLineIdFn } from "../repositories/users";
import type { FlowResRegisterUserDTO } from "../dtos";
import type {
  VerifyTokenFn,
  GetProfileFn,
  GetProfileSuccess,
} from "../../utils/line";

export type FlowRegisterUserArgs = {
  phoneNo: string;
  email: string;
  registeredAT?: string;
  lineAT: string;
};
export type FlowRegisterUserDeps = {
  getApiAnypayUserByEmailAndPhone: GetUserByEmailAndPhoneNoFn;
  verifyLineToken: VerifyTokenFn;
  getLineProfile: GetProfileFn;
  createUser: CreateUserFn;
  getUserByLineId: GetUserByLineIdFn;
};
export type FlowRegisterUserFn = (
  apianypayConn: PoolConnection,
  conn: PoolConnection,
  args: FlowRegisterUserArgs,
  deps: FlowRegisterUserDeps
) => Promise<FlowResponse<FlowResRegisterUserDTO>>;
export const registerUserFlow: FlowRegisterUserFn = async (
  apianypayConn,
  conn,
  args,
  deps
) => {
  try {
    const { email, phoneNo, lineAT } = args;
    const apiAnypayUser = await deps.getApiAnypayUserByEmailAndPhone(
      apianypayConn,
      email,
      phoneNo
    );
    if (!apiAnypayUser) {
      return { status: 404, errors: [{ message: "user not found" }] };
    }

    const verifyResponse = await deps.verifyLineToken(lineAT);
    const getLineProfileResponse = await deps.getLineProfile(lineAT);
    if (verifyResponse.status == "fails") {
      return { status: 401, errors: [] };
    }

    const {
      data: { sub: lineId },
    } = getLineProfileResponse as GetProfileSuccess;
    await deps.createUser(conn, { lineId, email, phoneNo });
    conn.commit(); // **

    const user = await deps.getUserByLineId(conn, lineId);
    if (!user) {
      return { status: 404, errors: [] };
    }

    return { status: 200, message: "register user successful", data: user };
  } catch (err) {
    return { status: 500, errors: [] };
  }
};
