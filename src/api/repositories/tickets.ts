import type { PoolConnection } from "mysql2/promise";
import { v4 } from "uuid";

import type { TicketCreateDAO, TicketWithImageDAO } from "../daos";

export type CreateTicketFn = (
  conn: PoolConnection,
  dao: TicketCreateDAO
) => Promise<string>;
export const createTicket: CreateTicketFn = async (conn, dao) => {
  const ticketId = v4();
  const sql = `
      INSERT INTO tickets (
        id,
        name, 
        detail, 
        issueTopicId,
        currentStatus,
        cAt,
        uAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    ticketId,
    dao.name,
    dao.detail,
    dao.issueTopicId,
    "new",
    new Date(),
    new Date(),
  ];
  await conn.execute(sql, values);
  return ticketId;
};

export type GetTicketWithImagesByIdFn = (
  conn: PoolConnection,
  id: string
) => Promise<TicketWithImageDAO[]>;
export const getTicketWithImagesById: GetTicketWithImagesByIdFn = async (
  conn,
  id
) => {
  const sql = `
      SELECT * FROM tickets t
      LEFT JOIN ticket_images ti 
        ON ti.ticketId = t.id
      WHERE t.id = ?`;
  const [records] = await conn.query(sql, [id]);
  return records as TicketWithImageDAO[];
};
