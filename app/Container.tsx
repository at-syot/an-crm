"use client";

import liff from "@line/liff";
import { useEffect, useState } from "react";

const useInitLiff = () => {
  const [accessToken, setAccessToken] = useState<string>();
  useEffect(() => {
    liff.ready.then(() => {
      const accessToken = liff.getAccessToken();
      setAccessToken(accessToken?.toString());
    });

    liff.init({ liffId: "1584232670-QOz40bj9" }).then();
  }, []);

  return { accessToken };
};

const useCheckLineUserExist = (lineAccessToken: string | undefined) => {
  const [response, setResponse] = useState<any | null>();
  const [err, setErr] = useState<any | null>();

  useEffect(() => {
    fetch("/api/users/check-existing", {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
        body: JSON.stringify({ lintAT: lineAccessToken }),
      },
    }).then((r) => {
      if (r.status == 200) {
        r.json().then((json) => setResponse(json));
      } else {
        setErr({});
      }
    });
  }, []);

  return { response, err };
};

export default function Container() {
  const { accessToken } = useInitLiff();
  const { response, err } = useCheckLineUserExist(accessToken);
  if (err) {
    return (
      <p style={{ color: "red", fontWeight: "bold" }}>
        Please allow line's permissions.
      </p>
    );
  }

  return (
    <div>
      <p>response {JSON.stringify(response, null, 2)}</p>
    </div>
  );
}
