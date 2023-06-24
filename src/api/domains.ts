type Unit = {
  cAt?: Date;
  cBy?: string;
  uAt?: Date;
  uBy?: string;
};

// users.apianypay
export type ApiAnypayUser = {
  u_id: string;
  u_account_type: string;
  u_email: string;
  u_firstname: string;
  u_lastname: string;
  u_home_phone: string;
  u_mobile_phone: string;
  u_businessName: string;
  u_busn_type: string;
};

// users
export type User = {
  id: string;
  lineId: string;
  phoneNo: string;
  email: string;
  active: boolean;
} & Unit;

// tickets
export enum TicketStatus {
  NEW = "new",
  ACCEPTED = "accepted",
  PROCESSING = "processing",
  FINISHED = "finished",
}
export type Ticket = {
  id: string;
  merchantName?: string;
  name: string;
  currentStatus: TicketStatus;
  issueTopicId: string;
  detail?: string;
} & Unit;
export type TicketImage = {
  id: string;
  ticketId: string;
  uri: string;
  cAt?: Date;
};
export type TicketImageOnlyURI = Pick<TicketImage, "uri">;

// ticketLog
export type TicketLog = {
  id: string;
  ticketId: string;
  status: string;
} & Unit;
