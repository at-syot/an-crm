import type { PoolConnection } from "mysql2/promise";

import type { UpdateTicketByIdFn } from "../repositories/tickets";
import type { FlowResponse } from "./types";
import type { FlowUpdateTicketDTO } from "../dtos";

export type FlowUpdateTicketDeps = {
  updateTicketById: UpdateTicketByIdFn;
};
export type FlowUpdateTicketFn = (
  conn: PoolConnection,
  args: FlowUpdateTicketDTO,
  deps: FlowUpdateTicketDeps
) => Promise<FlowResponse<void>>;
export const updateTicketFlow: FlowUpdateTicketFn = async (
  conn,
  args,
  deps
) => {
  try {
    await deps.updateTicketById(conn, args);
    return { status: 200, message: "udpate ticket successful" };
  } catch (err) {
    console.log(typeof err);
    console.log(err);
    return { status: 500, errors: [] };
  }
};
