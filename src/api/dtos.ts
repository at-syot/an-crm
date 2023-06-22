import type { Files } from "formidable";
import type { Ticket, TicketImageOnlyURI } from "./domains";

// handlers request & response
export type ReqCreateTicketDTO = {
  ticketName: string;
  issueId: string;
  detail?: string;
};
export type ResCreateTicketDTO = Ticket & { images: TicketImageOnlyURI[] };

// flows
export type FlowCreateTicketDTO = ReqCreateTicketDTO & { images: Files };
export type FlowResCreateTicketDTO = ResCreateTicketDTO;
