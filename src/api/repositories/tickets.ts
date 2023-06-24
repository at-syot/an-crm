import type { PoolConnection } from "mysql2/promise";
import { v4 } from "uuid";

import type {
  TicketCreateDAO,
  TicketWithImageDAO,
  AllTicketsWithImagesDAO,
} from "../daos";

export type GetAllTicketsWithImageFn = (
  conn: PoolConnection
) => Promise<TicketWithImageDAO[]>;
export const getAllTicketsWithImage: GetAllTicketsWithImageFn = async (
  conn
) => {
  const sql = `
    SELECT 
	    t.*,
	    ti.uri as imageURI,
	    it.name as issueName
    FROM tickets t 
    LEFT JOIN ticket_images ti ON t.id = ti.ticketId
    LEFT JOIN issue_topics it ON t.issueTopicId = it.id 
    ORDER BY t.uAt DESC`;
  const [ticketsWithImage] = await conn.query(sql);
  return ticketsWithImage as TicketWithImageDAO[];
};

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
) => Promise<AllTicketsWithImagesDAO>;
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
  return records as AllTicketsWithImagesDAO;
};
