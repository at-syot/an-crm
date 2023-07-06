import { useEffect } from "react";
import { useAtom } from "jotai";

import {
  renderingPageAtom,
  lineAccessTokenAtom,
  fetchingAtom,
  userAtom,
} from "../../states";

import Register from "../Register";
import Tickets from "../Tickets";
import CreateTicketPage from "../CreateTicket";
import TicketViewEdit from "../TicketViewEdit";
import { useTicketsDataHandlers } from "../hooks/useTicketsDataHandlers";
import { useIssuesDataFns } from "../hooks/useIssueDataFns";

export default function Entry() {
  useInitLiffAndCheckUserExist();
  useFetchTickets();
  useFetchIssues();
  const [renderingPage] = useAtom(renderingPageAtom);
  const [lineAT] = useAtom(lineAccessTokenAtom);

  if (renderingPage == "Entry")
    return <>checking line token & check user exist @by gh-workflow</>;
  if (renderingPage == "Register") return <Register lineAT={lineAT ?? ""} />;
  if (renderingPage == "ViewTickets") return <Tickets />;
  if (renderingPage == "CreateTicket") return <CreateTicketPage />;
  if (renderingPage == "TicketViewEdit") return <TicketViewEdit />;
  return <></>;
}

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
  const [, setFetching] = useAtom(fetchingAtom);
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    import("@line/liff").then(async ({ liff }) => {
      liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const accessToken = liff.getAccessToken();
          if (accessToken) {
            setFetching(true);

            const response = await checkLineUserExist(accessToken);
            setUser(response.errors ? undefined : response.data);
            setRenderingPage(response.errors ? "Register" : "ViewTickets");
            setLineAccessToken(accessToken);

            setFetching(false);
          }
        }
      });

      await liff.init({ liffId: "1584232670-QOz40bj9" });
    });
  }, []);
};

const useFetchTickets = () => {
  const [lineAccessToken] = useAtom(lineAccessTokenAtom);
  const { fetchTickets } = useTicketsDataHandlers();
  useEffect(() => {
    if (lineAccessToken) {
      fetchTickets();
    }
  }, [lineAccessToken]);
};

const useFetchIssues = () => {
  const [lineAccessToken] = useAtom(lineAccessTokenAtom);
  const { fetchIssues } = useIssuesDataFns();
  useEffect(() => {
    if (lineAccessToken) {
      fetchIssues();
    }
  }, [lineAccessToken]);
};
