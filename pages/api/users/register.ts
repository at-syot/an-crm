import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/database";
import joi from "joi";

const requiredStr = joi.string().required();
const schema = joi.object({
  phoneNo: requiredStr,
  email: requiredStr,
  registeredAT: joi.string().allow("").optional(), // ANP specific access-token
  lineAT: requiredStr.allow(""),
});

export default async function tickets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { error: validateErr } = schema.validate(req.body);
  if (validateErr) {
    console.log("validation err", validateErr);
    return res.status(422).end();
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
    const [users] = await conn.query(sql, values);
    if ((users as Array<Record<string, any>>).length <= 0) {
      return res.status(404).json({ message: "User is not found." });
    }

    // get line user's profile by the given token
    // extract line user id from user's profile
    // save to anpcrm.user { lineId, phoneNo, active[true] }
    const lineUserProfileResponse = await fetch(
      "https://api.line.me/oauth2/v2.1/userinfo",
      {
        headers: { Authorization: `Bearer ${lineAT}` },
      }
    ).then((r) => r.json());
    const { sub, name } = lineUserProfileResponse;
    console.log("sub ------", sub);

    return res.json({ data: users, sub });
  } catch (err) {
    console.log("err ----", err);
    return res.status(500).json(null);
  }
}
