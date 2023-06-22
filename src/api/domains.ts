// tickets

export type Ticket = {
  id: string;
  merchantName?: string;
  name: string;
  currentStatus: string;
  issueTopicId: string;
  detail?: string;
  cAt?: Date;
  cBy?: Date;
  uAt?: Date;
  uBy?: Date;
};
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
  cAt?: Date;
  cby?: Date;
};
