type Unit = {
  cAt?: Date;
  cBy?: string;
  uAt?: Date;
  uBy?: string;
  dAt?: Date;
  dBy?: string;
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
export type UserRole = "client" | "admin" | "super-admin" | "system";
export type User = {
  id: string;
  lineId: string;
  phoneNo: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
} & Unit;

// tickets
export type TicketStatus = "new" | "accepted" | "processing" | "finished";
export type Ticket = {
  id: string;
  userId: string;
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

// ticketLog
export type TicketLog = {
  id: string;
  ticketId: string;
  status: string;
} & Unit;

// issueTopics
export type IssueTopic = {
  id: string;
  name: string;
  parentId?: string;
  active: boolean;
};
