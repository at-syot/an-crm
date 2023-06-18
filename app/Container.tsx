"use client";

import liff from "@line/liff";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { renderingPageAtom, lineAccessTokenAtom } from "../src/states";

import Register from "../src/components/Register";
import Tickets from "../src/components/Tickets";
import CreateTicketPage from "../src/components/CreateTicket";

const checkLineUserExist = (lineAccessToken: string) =>
  fetch("/api/users/check-existing", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify({ lineAT: lineAccessToken }),
  }).then((r) => r.json());

const useInitLiffAndCheckUserExist = () => {
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const [, setLineAccessToken] = useAtom(lineAccessTokenAtom);

  useEffect(() => {
    const initLiff = async () => {
      liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const accessToken = liff.getAccessToken();
          if (accessToken) {
            const response = await checkLineUserExist(accessToken);
            setRenderingPage(response.errors ? "Register" : "ViewTickets");
            setLineAccessToken(accessToken);
          }
        }
      });

      // liffID should be in the config
      await liff.init({ liffId: "1584232670-QOz40bj9" });
    };

    initLiff();
  }, []);
};

export default function Container() {
  useInitLiffAndCheckUserExist();
  const [renderingPage] = useAtom(renderingPageAtom);
  const [lineAT] = useAtom(lineAccessTokenAtom);

  if (renderingPage == "Entry")
    return <>checking line token & check user exist</>;
  if (renderingPage == "Register") return <Register lineAT={lineAT ?? ""} />;
  if (renderingPage == "ViewTickets") return <Tickets />;
  if (renderingPage == "CreateTicket") return <CreateTicketPage />;
}
