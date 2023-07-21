import type {
  Ticket,
  TicketImage,
  TicketLog,
  User,
  ApiAnypayUser,
  IssueTopic,
} from "./domains";

// users.apianypay
export type ApiAnypayUserDAO = ApiAnypayUser;

// users
export type UserDAO = User;
export type CreateClientUserDAO = Pick<UserDAO, "lineId" | "phoneNo">;
export type CreateAdminUserDAO = Pick<
  UserDAO,
  "username" | "password" | "role" | "cBy"
>;
export type UpdateAdminUserDAO = Pick<
  UserDAO,
  "id" | "username" | "password" | "role" | "uBy"
>;
export type DeleteUserDAO = Pick<UserDAO, "dBy" | "id">;

// tickets
export type TicketDAO = Ticket;
export type TicketCreateDAO = Omit<TicketDAO, "id">;
export type TicketWithImageDAO = TicketDAO &
  TicketImageIncludedDAO &
  IssueTopicIncludedDAO;
export type AllTicketsWithImagesDAO = TicketWithImageDAO[];
export type TicketDeleteDAO = Pick<TicketDAO, "id" | "userId">;
export type UpdateTicketDAO = Pick<
  TicketDAO,
  "id" | "name" | "issueTopicId" | "detail"
>;

// ticket image
export type TicketImageDAO = TicketImage;
export type TicketImageIncludedDAO = {
  imageId: string;
  uri: string;
  displayUri: string;
};

// ticketLog
export type TicketLogCreateDAO = Omit<TicketLog, "id">;

// issueTopic
export type IssueTopicIncludedDAO = {
  issueId: string;
  issueName: string;
};
