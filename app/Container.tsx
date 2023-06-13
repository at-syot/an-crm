"use client";

import liff from "@line/liff";
import { useEffect, useState } from "react";

export default function Container() {
  const [runningOS, setRunningOS] = useState<string>();
  const [lineAT, setLineAT] = useState<string>();
  const [lineIDToken, setLineIDToken] = useState<string>();
  useEffect(() => {
    liff.ready.then(async () => {
      const os = liff.getOS();
      setRunningOS(os?.toString());

      try {
        const accessToken = liff.getAccessToken();
        const idToken = liff.getIDToken();
        setLineAT(accessToken?.toString());
        setLineIDToken(idToken?.toString());
      } catch (err) {
        console.log(err);
      }
    });

    liff.init({ liffId: "1584232670-QOz40bj9" }).then();
  }, []);
  return (
    <div>
      <p>running os - {runningOS}</p>
      <p>access-token - {lineAT}</p>
      <p>id-token - {lineIDToken}</p>
    </div>
  );
}
