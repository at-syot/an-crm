import type { PoolConnection } from "mysql2/promise";
import type { VerifyTokenFn, GetProfileFn } from "../../utils/line";
import type { GetUserByLineIdFn } from "../repositories/users";
import type { FlowResponse } from "./types";
import { FlowResCheckUserExistDTO } from "../dtos";

export type FlowCheckUserExistArgs = {
  lineAccessToken: string;
};
export type FlowCheckUserExistDeps = {
  verifyLineAccessToken: VerifyTokenFn;
  getLineProfile: GetProfileFn;
  getUserByLineId: GetUserByLineIdFn;
};
export type FlowCheckUserExistFn = (
  conn: PoolConnection,
  args: FlowCheckUserExistArgs,
  deps: FlowCheckUserExistDeps
) => Promise<FlowResponse<FlowResCheckUserExistDTO>>;
export const checkUserExistFlow: FlowCheckUserExistFn = async (
  conn,
  args,
  deps
) => {
  try {
    const { lineAccessToken } = args;
    const verifyResponse = await deps.verifyLineAccessToken(lineAccessToken);
    if (verifyResponse.status == "fails") {
      return {
        status: 401,
        errors: [{ message: "line access-token is invalid or expired" }],
      };
    }

    const getProfileResponse = await deps.getLineProfile(lineAccessToken);
    if (getProfileResponse.status == "fails") {
      return {
        status: 401,
        errors: [{ message: "get line profile error" }],
      };
    }
    const { sub: lineId } = getProfileResponse.data;
    const user = await deps.getUserByLineId(conn, lineId);
    if (!user) {
      return { status: 404, errors: [{ message: "user not found" }] };
    }
    return { status: 200, message: "user is registed", data: user };
  } catch (err) {
    return { status: 500, errors: [] };
  }
};
