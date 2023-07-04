import { useAtom } from "jotai";
import {
  openDeleteTicketDialogAtom,
  renderingPageAtom,
  viewingTicketAtom,
} from "../../../states";
import { useTicketsDataHandlers } from "../../hooks/useTicketsDataHandlers";
import { useTicketImageDataFns } from "../../hooks/useTicketImageDataFns";
import { ChangeEvent } from "react";
import { ClientSuccessResponse, isClientFailResponse } from "../../../client";
import {
  TicketWithImagesDTO,
  TicketImageIncludedDTO,
} from "../../../data.types";

export const useDeleteTicketAction = () => {
  const [ticket] = useAtom(viewingTicketAtom);
  const [, setRenderingPage] = useAtom(renderingPageAtom);
  const { deleteTicket, fetchTickets } = useTicketsDataHandlers();
  const [, setOpenDeleteTicketDialog] = useAtom(openDeleteTicketDialogAtom);

  return {
    onDeleteTicketConfirm: async () => {
      if (!ticket) return;
      setOpenDeleteTicketDialog(false);
      await deleteTicket(ticket);
      await fetchTickets();
      setRenderingPage("ViewTickets");
    },
  };
};

// DOs
// - check updated image length
// - create ticket image
// - fetch tikets
// - fetch ticket by id (retrive latest ticket data)
// - clear input file
// - set ticket data to viewingTicketAtom (re render)
export const useOnInputFileChangeAction = () => {
  const [viewingTicket, setViewingTicket] = useAtom(viewingTicketAtom);
  const { fetchTickets, fetchTicketById } = useTicketsDataHandlers();
  const { createTicketImage } = useTicketImageDataFns();

  const onInputFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!viewingTicket || !viewingTicket.id) return;
    if (!files) return;
    if (!files[0]) return;
    if (viewingTicket.images.length == 3) {
      return alert(`only 3 images are allowed to upload.`);
    }

    const { id: ticketId } = viewingTicket;
    const touploadFile = files[0] satisfies File;
    const createTicketImageResponse = await createTicketImage(
      ticketId,
      touploadFile
    );
    if (isClientFailResponse(createTicketImageResponse)) {
      const { errors } = createTicketImageResponse;
      return alert(`create ticket error: ${errors[0].message}`);
    }

    await fetchTickets();
    const fetchTicketResponse = await fetchTicketById(viewingTicket.id);
    if (isClientFailResponse(fetchTicketResponse)) {
      const { errors } = fetchTicketResponse;
      return alert(`fetching ticket error: ${errors[0].message}`);
    }

    const { data } =
      fetchTicketResponse satisfies ClientSuccessResponse<TicketWithImagesDTO>;
    e.target.value = "";
    setViewingTicket(data);
  };

  return { onInputFileChange };
};

export const useOnDeleteTicketImageAction = () => {
  const [viewingTicket, setViewingTicket] = useAtom(viewingTicketAtom);

  const { deleteTicketImage } = useTicketImageDataFns();
  const { fetchTickets, fetchTicketById } = useTicketsDataHandlers();

  const onDeleteTicketImageClick = async (image: TicketImageIncludedDTO) => {
    if (!viewingTicket) return;

    const { id } = viewingTicket;
    const { imageId, uri } = image;
    const deleteResponse = await deleteTicketImage(id, imageId, uri);
    const processErrMsg = "delete ticket image error";
    if (isClientFailResponse(deleteResponse)) {
      return alert(processErrMsg);
    }

    await fetchTickets();
    const fetchTicketResp = await fetchTicketById(id);
    if (isClientFailResponse(fetchTicketResp)) {
      return alert(processErrMsg);
    }

    const { data } =
      fetchTicketResp as ClientSuccessResponse<TicketWithImagesDTO>;
    console.log("after delete image data", data);
    setViewingTicket(data);
  };

  return { onDeleteTicketImageClick };
};
