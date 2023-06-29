import type { PoolConnection } from "mysql2/promise";
import { FlowDeleteTicketImageDTO } from "../dtos";
import { FlowResponse } from "./types";

import { DeleteFileInS3Fn } from "../../utils/aws";
import { DeleteTicketImageFn } from "../repositories/ticketImages";

export type FlowDeleteTicketImageDeps = {
  deleteTicketImage: DeleteTicketImageFn;
  deleteS3File: DeleteFileInS3Fn;
};
export type FlowDeleteTicketImageFn = (
  conn: PoolConnection,
  args: FlowDeleteTicketImageDTO,
  deps: FlowDeleteTicketImageDeps
) => Promise<FlowResponse<{}>>;
export const deleteTicketImageFlow: FlowDeleteTicketImageFn = async (
  conn,
  args,
  deps
) => {
  try {
    const { ticketId, id, uri } = args;
    await deps.deleteTicketImage(conn, ticketId, id);
    await deps.deleteS3File(uri);

    return { status: 200, message: "delete image success" };
  } catch (err) {
    console.log("delete image err", err);
    return { status: 500, errors: [{ message: "" }] };
  }
};
