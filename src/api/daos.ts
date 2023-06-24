import type { Ticket, TicketImage, TicketLog, User } from "./domains";

// users
export type UserDAO = User;

// tickets
export type TicketCreateDAO = Omit<Ticket, "id">;
export type TicketWithImageDAO = Ticket & Pick<TicketImage, "uri">;
export type AllTicketsWithImagesDAO = TicketWithImageDAO[];

// ticketLog
export type TicketLogCreateDAO = Omit<TicketLog, "id">;
