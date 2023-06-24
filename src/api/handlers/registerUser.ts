import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";

import * as db from "../database";
import { getUserByEmailAndPhoneNo } from "../repositories/users.apianypay";
import { createUser, getUserByLineId } from "../repositories/users";
import * as lineUtils from "../../utils/line";
import { registerUserFlow } from "../flows/registerUser";
import type {
  FlowRegisterUserArgs,
  FlowRegisterUserDeps,
} from "../flows/registerUser";

const requiredStr = joi.string().required();
const schema = joi.object({
  phoneNo: requiredStr,
  email: requiredStr,
  registeredAT: joi.string().allow("").optional(), // ANP specific access-token
  lineAT: requiredStr.allow(""),
});

export const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { error: validateErr } = schema.validate(req.body);
  if (validateErr) {
    console.log("validation err", validateErr);
    return res.status(422).end();
  }
  const { phoneNo, email, lineAT } = req.body;

  // required dbs
  const apianypayDBPool = db.getAPIAnypayDB();
  const anpcrmDBPool = db.getDB();
  const apianypayConn = await apianypayDBPool.getConnection();
  const anpcrmConn = await anpcrmDBPool.getConnection();
  apianypayConn.beginTransaction();
  anpcrmConn.beginTransaction();

  const flowArgs = {
    email: String(email),
    phoneNo: String(phoneNo),
    lineAT: String(lineAT),
  } satisfies FlowRegisterUserArgs;
  const flowDeps = {
    getApiAnypayUserByEmailAndPhone: getUserByEmailAndPhoneNo,
    verifyLineToken: lineUtils.verifyToken,
    getLineProfile: lineUtils.getProfile,
    createUser: createUser,
    getUserByLineId: getUserByLineId,
  } satisfies FlowRegisterUserDeps;
  const { status, ...flowResponse } = await registerUserFlow(
    apianypayConn,
    anpcrmConn,
    flowArgs,
    flowDeps
  );
  if (status !== 200) {
    await apianypayConn.rollback();
    await anpcrmConn.rollback();
    return res.status(status).json(flowResponse);
  }

  return res.json(flowResponse);
};
