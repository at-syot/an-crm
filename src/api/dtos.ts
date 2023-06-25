import type { Files } from "formidable";
import type {
  IssueTopicIncludedDAO,
  TicketDAO,
  TicketImageIncludedDAO,
  UserDAO,
} from "./daos";

// dtos
export type UserDTO = UserDAO;
export type TicketWithImagesDTO = TicketDAO & {
  images: TicketImageIncludedDAO[];
} & IssueTopicIncludedDAO;

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
