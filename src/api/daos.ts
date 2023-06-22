import type { Ticket, TicketImage, TicketLog } from "./domains";

// tickets
export type TicketCreateDAO = Omit<Ticket, "id">;
export type TicketWithImageDAO = Ticket & Omit<TicketImage, "id" | "cAt">;
export type AllTicketsWithImagesDAO = TicketWithImageDAO[];

// ticketLog
export type TicketLogCreateDAO = Omit<TicketLog, "id">;