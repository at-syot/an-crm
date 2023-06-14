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
    return res.status(422).end();
  }

  try {
    const lineVerifyTokenURL = "https://api.line.me/oauth2/v2.1/verify";
    const verifyToken = fetch(`${lineVerifyTokenURL}?access_token=${lineAT}`);

    const getLineUserProfileURL = "https://api.line.me/oauth2/v2.1/userinfo";
    const getLineUserProfile = fetch(getLineUserProfileURL, {
      headers: { Authorization: `Bearer ${lineAT}` },
    });

    const responses = await Promise.allSettled([
      verifyToken,
      getLineUserProfile,
    ]);
    const responseErrors = responses.filter((r) => r.status == "rejected");
    if (responseErrors.length > 0) {
      responseErrors.forEach(console.log);
      return res.status(500).end();
    }

    const [_, profile] = responses;
    console.log("------- response", responses);
    return res.json({ message: "verify success.", profile });
  } catch (err) {
    console.log("catch error", err);
    return res.status(500).end();
  }
}
