import type { PoolConnection } from "mysql2/promise";
import type {
  CreateTicketFn,
  GetTicketWithImagesByIdFn,
} from "../repositories/tickets";
import type { CreateTicketLogFn } from "../repositories/ticketLog";
import type {
  CreateTicketImagesFn,
  UploadTicketImagesToS3Fn,
} from "../repositories/ticketImages";
import { TicketStatus } from "../domains";
import type { FlowCreateTicketDTO, FlowResCreateTicketDTO } from "../dtos";
import type { FromTicketWithImageDAO_to_FlowDAOFn } from "../transformers";

export type FlowCreateTicketDeps = {
  createTicket: CreateTicketFn;
  createTicketLog: CreateTicketLogFn;
  uploadTicketImagesToS3: UploadTicketImagesToS3Fn;
  createTicketImages: CreateTicketImagesFn;
  getTicketWithImages: GetTicketWithImagesByIdFn;
  toResponse: FromTicketWithImageDAO_to_FlowDAOFn;
};
export type FlowCreateTicketFn = (
  conn: PoolConnection,
  args: FlowCreateTicketDTO,
  deps: FlowCreateTicketDeps
) => Promise<FlowResCreateTicketDTO>;
export const createTicketFlow: FlowCreateTicketFn = async (
  conn,
  args,
  deps
) => {
  const { userId, ticketName, issueId, detail, images } = args;
  const ticketStatus = TicketStatus.NEW;
  const ticketId = await deps.createTicket(conn, {
    userId,
    name: ticketName,
    issueTopicId: issueId,
    currentStatus: ticketStatus,
    detail,
  });
  await deps.createTicketLog(conn, ticketId, {
    ticketId,
    status: ticketStatus,
  });
  const uris = await deps.uploadTicketImagesToS3(ticketId, images);
  await deps.createTicketImages(conn, ticketId, uris);
  const daos = await deps.getTicketWithImages(conn, ticketId);
  return deps.toResponse(daos);
};
