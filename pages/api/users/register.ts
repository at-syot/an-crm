import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/database";
import * as lineUtils from "../../../src/utils/line";
import type { GetProfileSuccess } from "../../../src/utils/line";
import { v4 } from "uuid";
import joi from "joi";

const requiredStr = joi.string().required();
const schema = joi.object({
  phoneNo: requiredStr,
  email: requiredStr,
  registeredAT: joi.string().allow("").optional(), // ANP specific access-token
  lineAT: requiredStr.allow(""),
});

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { error: validateErr } = schema.validate(req.body);
  if (validateErr) {
    console.log("validation err", validateErr);
    return res.status(422).end();
  }

  const { phoneNo, email, lineAT } = req.body;
  try {
    // check user existing by email and phoneNo
    const sql = `
      SELECT * FROM user 
      WHERE u_email = ? 
      AND (u_home_phone = ? OR u_mobile_phone = ?) 
    `;
    const values = [email, phoneNo, phoneNo];

    const pool = db.getAPIAnypayDB();
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const [users] = await conn.query(sql, values);
    if ((users as Array<Record<string, any>>).length <= 0) {
      return res.status(404).json({ message: "User is not found." });
    }

    // line process
    const verifyLineTokenResponse = await lineUtils.verifyToken(lineAT);
    if (verifyLineTokenResponse.status == "fails") {
      // TODO: get error message
      return res.status(401).json({});
    }

    const getLineProfileResponse = await lineUtils.getProfile(lineAT);
    if (getLineProfileResponse.status == "fails") {
      // TODO: get error message
      return res.status(401).json({});
    }
    const {
      data: { sub: lineId },
    } = getLineProfileResponse as GetProfileSuccess;

    const crmDBPool = db.getDB();
    const crmConn = await crmDBPool.getConnection();
    // register new user with lineId
    const newUserId = v4();
    const insertSqlValues = [newUserId, lineId, phoneNo];
    const insertSql = `
      INSERT INTO users(
        id,
        lineId,
        phoneNo
      ) VALUES (?, ?, ?)`;
    await crmConn.execute(insertSql, insertSqlValues);

    const selectLastestSaveSql = `
      SELECT * FROM users 
      WHERE id = ? LIMIT 1`;
    console.log("values", newUserId);
    const [user] = await crmConn.query(selectLastestSaveSql, [newUserId]);

    return res
      .status(200)
      .json({ message: "new user is registered", data: user });
  } catch (err) {
    console.log("err ----", err);
    return res.status(500).json(null);
  }
}
