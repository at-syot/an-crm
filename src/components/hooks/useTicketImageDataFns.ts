import { useAtom } from "jotai";
import { fetchingAtom } from "../../states";
import { isClientFailResponse, isClientSuccessResponse } from "../../client";
import { useTicketsDataHandlers } from "./useTicketsDataHandlers";

export const useTicketImageDataFns = () => {
  const { deleteTicketImage } = useDeleteTicketImageAction();
  const { createTicketImage } = useCreateTicketImageAction();

  return { deleteTicketImage, createTicketImage };
};

const useDeleteTicketImageAction = () => {
  const [, setFetching] = useAtom(fetchingAtom);

  const deleteTicketImage = async (
    ticketId: string,
    id: string,
    uri: string
  ) => {
    setFetching(true);
    const body = JSON.stringify({ id: String(id), uri: String(uri) });
    const response = await fetch(`/api/tickets/${ticketId}/images/delete`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body,
    });
    setFetching(false);

    const json: unknown = await response.json();
    return json;
  };
  return { deleteTicketImage };
};

const useCreateTicketImageAction = () => {
  const [, setFetching] = useAtom(fetchingAtom);

  const createTicketImage = async (ticketId: string, file: File) => {
    const formData = new FormData();
    formData.append("ticketId", ticketId);
    formData.append("image", file);

    setFetching(true);
    const response = await fetch(`/api/tickets/${ticketId}/images/create`, {
      method: "POST",
      body: formData,
    });
    const json: unknown = await response.json();
    setFetching(false);

    return json;
  };
  return { createTicketImage };
};
