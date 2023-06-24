import type {
  Ticket,
  TicketImage,
  TicketLog,
  User,
  ApiAnypayUser,
} from "./domains";

// users.apianypay
export type ApiAnypayUserDAO = ApiAnypayUser;

// users
export type UserDAO = User;
export type CreateUserDAO = Omit<User, "id" | "active">;

// tickets
export type TicketCreateDAO = Omit<Ticket, "id">;
export type TicketWithImageDAO = Ticket & Pick<TicketImage, "uri">;
export type AllTicketsWithImagesDAO = TicketWithImageDAO[];

// ticketLog
export type TicketLogCreateDAO = Omit<TicketLog, "id">;
