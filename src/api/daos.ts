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
export type CreateUserDAO = Omit<User, "id" | "active">;

// tickets
export type TicketDAO = Ticket;
export type TicketCreateDAO = Omit<TicketDAO, "id">;
export type TicketWithImageDAO = TicketDAO &
  TicketImageIncludedDAO &
  IssueTopicIncludedDAO;
export type AllTicketsWithImagesDAO = TicketWithImageDAO[];
export type TicketDeleteDAO = Pick<TicketDAO, "id" | "userId">;

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
