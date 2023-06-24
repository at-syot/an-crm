import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";

import * as db from "../database";
import { checkUserExistFlow } from "../flows";
import type { FlowResponseFail } from "../flows";
import type {
  FlowCheckUserExistArgs,
  FlowCheckUserExistDeps,
} from "../flows/checkUserExist";
import * as lineUtils from "../../utils/line";
import { getUserByLineId } from "../repositories/users";

const requiredStr = joi.string().required();
const schema = joi.object({
  phoneNo: requiredStr,
  email: requiredStr,
  registeredAT: joi.string().allow("").optional(), // ANP specific access-token
  lineAT: requiredStr.allow(""),
});

export const checkUserExisting = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { lineAT } = req.body;
  if (!lineAT) {
    console.log("invalid req.body");
    return res.status(422).json(null);
  }

  const pool = db.getDB();
  const conn = await pool.getConnection();
  const flowArgs = {
    lineAccessToken: String(lineAT),
  } satisfies FlowCheckUserExistArgs;
  const flowDeps = {
    verifyLineAccessToken: lineUtils.verifyToken,
    getLineProfile: lineUtils.getProfile,
    getUserByLineId: getUserByLineId,
  } satisfies FlowCheckUserExistDeps;
  const flowResponse = await checkUserExistFlow(conn, flowArgs, flowDeps);
  if (flowResponse.status !== 200) {
    return res
      .status(flowResponse.status)
      .json({ errors: (flowResponse as FlowResponseFail).errors });
  }

  return res.json(flowResponse);
};
