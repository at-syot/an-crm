import type { Files } from "formidable";
import type {
  IssueTopicIncludedDAO,
  TicketDAO,
  TicketDeleteDAO,
  TicketImageDAO,
  TicketImageIncludedDAO,
  TicketWithImageDAO,
  UserDAO,
} from "./daos";

// dtos
export type UserDTO = UserDAO;
export type TicketWithImagesDTO = TicketDAO & {
  images: TicketImageIncludedDAO[];
} & IssueTopicIncludedDAO;
export type TicketImageIncludedDTO = TicketImageIncludedDAO;

export type AllTicketsWithImagesDTO = TicketWithImagesDTO[];

// handlers request & response
export type ReqCreateTicketDTO = {
  userId: string;
  ticketName: string;
  issueId: string;
  detail?: string;
};
export type ResCreateTicketDTO = TicketWithImagesDTO;

// flows

// -- register user
export type FlowResRegisterUserDTO = UserDAO;

// -- check user exist
export type FlowResCheckUserExistDTO = UserDAO;

// -- create ticket
export type FlowCreateTicketDTO = ReqCreateTicketDTO & { images: Files };
export type FlowResCreateTicketDTO = TicketWithImagesDTO;

// -- get all tickets
export type FlowResGetAllTicketsDTO = AllTicketsWithImagesDTO;

// -- delete ticket
export type FlowDeleteTicketDTO = TicketDeleteDAO;
export type FlowResDeleteTicketDTO = TicketWithImagesDTO;

// -- delete ticket'image
export type FlowDeleteTicketImageDTO = Omit<TicketImageDAO, "cAt">;
