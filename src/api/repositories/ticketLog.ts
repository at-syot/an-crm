import type { PoolConnection } from "mysql2/promise";
import type { TicketLogCreateDAO } from "../daos";

export type CreateTicketLogFn = (
  conn: PoolConnection,
  ticketId: string,
  ticketLogCreateDAO: TicketLogCreateDAO
) => Promise<void>;
export const createTicketLog: CreateTicketLogFn = async (
  conn,
  ticketId,
  dao
) => {
  const sql = `
      INSERT INTO ticket_logs (status, cAt, ticketId) 
      VALUES (?, ?, ?)`;
  const values = [dao.status, new Date(), ticketId];
  await conn.execute(sql, values);
};
