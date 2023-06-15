import type { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/database";

// TODO: big refactor!
// - db connections [crmPool, apianypaydbPool]
export default async function checkLineUserExist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lineAT } = req.body;
  if (!lineAT) {
    console.log("invalid req.body");
    return res.status(422).json(null);
  }

  try {
    const lineVerifyTokenURL = "https://api.line.me/oauth2/v2.1/verify";
    const verifyTokenResponse = await fetch(
      `${lineVerifyTokenURL}?access_token=${lineAT}`
    );
    if (verifyTokenResponse.status != 200) {
      console.log("verifyToken error", verifyTokenResponse);
      return res.status(401).json({
        errors: [{ message: "line access-token is invalid or expired" }],
      });
    }

    const getLineUserProfileURL = "https://api.line.me/oauth2/v2.1/userinfo";
    const getLineUserProfileResponse = await fetch(getLineUserProfileURL, {
      headers: { Authorization: `Bearer ${lineAT}` },
    });
    if (getLineUserProfileResponse.status != 200) {
      console.log("getLineUserProfileResponse error", verifyTokenResponse);
      return res
        .status(401)
        .json({ errors: [{ message: "get line profile error" }] });
    }

    const lineProfile = await getLineUserProfileResponse.json();
    const { sub: lineId } = lineProfile;

    const pool = db.getDB();
    const conn = await pool.getConnection();
    const [records] = await conn.query("SELECT * FROM users WHERE lineId = ?", [
      lineId,
    ]);
    const users = records as Array<Record<string, any>>;
    if (users.length == 0) {
      return res.status(404).json({ errors: [{ message: "user not found" }] });
    }

    return res.json({ message: "verify success.", data: lineProfile });
  } catch (err) {
    console.log("catch error", err);
    return res.status(500).end();
  }
}
