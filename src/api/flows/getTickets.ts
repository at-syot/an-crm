import type { PoolConnection } from "mysql2/promise";

import type { GetAllTicketsWithImageFn } from "../repositories/tickets";
import type { FromAllTicketsWithImageDAO_to_DTOFn } from "../transformers";
import type { FlowResGetAllTicketsDTO } from "../dtos";

export type FlowGetTicketsDeps = {
  getAllTicketsWithImage: GetAllTicketsWithImageFn;
  toResponse: FromAllTicketsWithImageDAO_to_DTOFn;
};
export type FlowGetTicketsFn = (
  conn: PoolConnection,
  deps: FlowGetTicketsDeps
) => Promise<FlowResGetAllTicketsDTO>;
export const getTicketsFlow: FlowGetTicketsFn = async (conn, deps) => {
  const tickets = await deps.getAllTicketsWithImage(conn);
  return await deps.toResponse(tickets);
};
