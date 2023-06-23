import { useEffect } from "react";
import { useAtom } from "jotai";

import {
  renderingPageAtom,
  lineAccessTokenAtom,
  fetchingAtom,
  ticketsWithImagesAtom,
} from "../../states";

import Register from "../Register";
import Tickets from "../Tickets";
import CreateTicketPage from "../CreateTicket";
import { AllTicketsWithImagesDTO } from "../../data.types";
import { widenedTypeToFormatedStr, DATE_FORMATS } from "../../utils/datetime";

export default function Entry() {
  useInitLiffAndCheckUserExist();
  useFetchTickets();
  const [renderingPage] = useAtom(renderingPageAtom);
  const [lineAT] = useAtom(lineAccessTokenAtom);

  if (renderingPage == "Entry")
    return <>checking line token & check user exist</>;
  if (renderingPage == "Register") return <Register lineAT={lineAT ?? ""} />;
  if (renderingPage == "ViewTickets") return <Tickets />;
  if (renderingPage == "CreateTicket") return <CreateTicketPage />;
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

const fetchTickets = async () => {
  const response = await fetch("/api/tickets");
  const tickets = (await response.json()) as AllTicketsWithImagesDTO;
  if (response.status !== 200) {
    return { errors: true };
  }

  return {
    data: tickets.map(({ uAt, ...ticket }) => {
      return {
        ...ticket,
        uAt: widenedTypeToFormatedStr(uAt, "-", DATE_FORMATS.DDsMMsYYYY),
      };
    }),
  };
};

const useFetchTickets = () => {
  const [lineAccessToken] = useAtom(lineAccessTokenAtom);
  const [, setTicketsWithImages] = useAtom(ticketsWithImagesAtom);
  useEffect(() => {
    if (lineAccessToken) {
      fetchTickets().then((response) => {
        const { errors, data } = response;
        if (errors) return;
        // @ts-ignore
        setTicketsWithImages(data);
      });
    }
  }, [lineAccessToken]);
};
