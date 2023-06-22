import type { Files } from "formidable";
import type { Ticket, TicketImageOnlyURI } from "./domains";

// dtos
export type TicketWithImagesDTO = Ticket & { images: TicketImageOnlyURI[] };
export type AllTicketsWithImagesDTO = TicketWithImagesDTO[];

// handlers request & response
export type ReqCreateTicketDTO = {
  ticketName: string;
  issueId: string;
  detail?: string;
};
export type ResCreateTicketDTO = TicketWithImagesDTO;

// flows

// -- create ticket
export type FlowCreateTicketDTO = ReqCreateTicketDTO & { images: Files };
export type FlowResCreateTicketDTO = TicketWithImagesDTO;

// -- get all tickets
export type FlowResGetAllTicketsDTO = AllTicketsWithImagesDTO;
