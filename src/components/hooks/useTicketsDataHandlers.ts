import { useAtom } from "jotai";
import { fetchingAtom, ticketsWithImagesAtom } from "../../states";
import type {
  AllTicketsWithImagesDTO,
  TicketWithImagesDTO,
} from "../../data.types";
import { isClientSuccessResponse } from "../../client";
import { widenedTypeToFormatedStr } from "../../utils/datetime";

export const useTicketsDataHandlers = () => {
  const { fetchTickets } = useFetchTicketsAction();
  const { deleteTicket } = useDeleteTicketAction();
  return {
    fetchTickets,
    deleteTicket,
  };
};

const useFetchTicketsAction = () => {
  const [, setTickets] = useAtom(ticketsWithImagesAtom);
  const [, setFetching] = useAtom(fetchingAtom);

  const doFetchTickets = async () => {
    setFetching(true);
    const response = await fetch("/api/tickets");
    const json: unknown = (await response.json()) as AllTicketsWithImagesDTO;
    setFetching(false);

    if (
      response.status === 200 &&
      isClientSuccessResponse<AllTicketsWithImagesDTO>(json) &&
      json.data
    ) {
      const tickets = json.data.map(({ uAt, ...ticket }) => ({
        ...ticket,
        uAt: widenedTypeToFormatedStr(uAt, "-", "DD/MM/YYYY"),
      }));

      // @ts-ignore
      setTickets(tickets);
      return { message: json.message };
    }
    return { errors: [] };
  };

  return { fetchTickets: doFetchTickets };
};

const useDeleteTicketAction = () => {
  const [, setFetching] = useAtom(fetchingAtom);

  const doDeleteTicket = async (ticket: TicketWithImagesDTO) => {
    setFetching(true);
    const body = JSON.stringify({ id: ticket?.id, userId: ticket?.userId });
    const response = await fetch(`/api/tickets/delete`, {
      method: "POST",
      headers: { ["Content-Type"]: "application/json" },
      body,
    });
    const json = await response.json();
    setFetching(false);

    const { status } = response;
    if (status === 200 && isClientSuccessResponse(json)) {
      return { message: json.message };
    }
    return { errors: [] };
  };

  return { deleteTicket: doDeleteTicket };
};
