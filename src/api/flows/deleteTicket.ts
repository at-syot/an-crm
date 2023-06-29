import type { PoolConnection } from "mysql2/promise";
import type {
  DeleteTicketFn,
  GetTicketWithImagesByIdFn,
} from "../repositories/tickets";
import type { FromTicketWithImageDAO_to_FlowDAOFn } from "../transformers";
import { FlowDeleteTicketDTO, FlowResDeleteTicketDTO } from "../dtos";
import { FlowResponse } from "./types";

export type FlowDeleteTicketArgs = FlowDeleteTicketDTO;
export type FlowDeleteTicketDeps = {
  deleteTicket: DeleteTicketFn;
  getTicket: GetTicketWithImagesByIdFn;
  toResponse: FromTicketWithImageDAO_to_FlowDAOFn;
};
export type FlowDeleteTicketFn = (
  conn: PoolConnection,
  args: FlowDeleteTicketArgs,
  deps: FlowDeleteTicketDeps
) => Promise<FlowResponse<FlowResDeleteTicketDTO>>;
export function isDeleteTicketFlowArgs(
  values: unknown
): values is FlowDeleteTicketArgs {
  return (values as FlowDeleteTicketArgs).userId !== undefined;
}

export const deleteTicketFlow: FlowDeleteTicketFn = async (
  conn,
  args,
  deps
) => {
  await deps.deleteTicket(conn, args);
  const ticket = await deps.getTicket(conn, args.id);
  const data = await deps.toResponse(ticket);
  return { status: 200, message: "", data };
};
