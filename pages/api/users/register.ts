import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/database";
import joi from "joi";

const requiredStr = joi.string().required();
const schema = joi.object({
  phonNo: requiredStr,
  email: requiredStr,
  lineAT: requiredStr,
});

export default async function tickets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { error: validateErr } = schema.validate(req.body);
  if (validateErr) {
    return res.status(422).json(null);
  }

  // retrive line access token
  const { phoneNo, email, lineAT } = req.body;
  try {
    const pool = db.getAPIAnypayDB();
    const conn = await pool.getConnection();
    const sql = `
      SELECT * FROM user 
      WHERE u_email = ? 
      AND (u_home_phone = ? OR u_mobile_phone = ?) 
    `;
    const values = [email, phoneNo, phoneNo];
    const [users, less] = await conn.query(sql, values);
    console.log("less");

    return res.json(users);
  } catch (err) {
    console.log("err ----", err);
    return res.status(500).json(null);
  }
}
