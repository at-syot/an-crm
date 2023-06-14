import type { NextApiRequest, NextApiResponse } from "next";
import liff from "@line/liff";

// Usecase
// use lineAT

export default async function checkLineUserExist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lineAT } = req.body;
  if (!lineAT) {
    console.log("no line at");
    return res.status(422).json(null);
  }

  try {
    const lineVerifyTokenURL = "https://api.line.me/oauth2/v2.1/verify";
    const verifyTokenResponse = await fetch(
      `${lineVerifyTokenURL}?access_token=${lineAT}`
    );
    if (verifyTokenResponse.status != 200) {
      return res.status(401).json({});
    }

    const getLineUserProfileURL = "https://api.line.me/oauth2/v2.1/userinfo";
    const getLineUserProfileResponse = await fetch(getLineUserProfileURL, {
      headers: { Authorization: `Bearer ${lineAT}` },
    });
    if (getLineUserProfileResponse.status != 200) {
      return res.status(401).json({});
    }

    const lineProfile = await getLineUserProfileResponse.json();

    return res.json({ message: "verify success.", data: lineProfile });
  } catch (err) {
    console.log("catch error", err);
    return res.status(500).end();
  }
}
