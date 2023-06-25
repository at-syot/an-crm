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
      ti.id as imageId,
	    ti.uri,
      it.id as issueId,
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
        userId,
        name, 
        detail, 
        issueTopicId,
        currentStatus,
        cAt,
        cBy,
        uAt,
        uBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    ticketId,
    dao.userId,
    dao.name,
    dao.detail,
    dao.issueTopicId,
    "new",
    new Date(),
    dao.userId,
    new Date(),
    dao.userId,
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
      SELECT 
        t.*, 
        ti.uri
      FROM tickets t
      LEFT JOIN ticket_images ti 
        ON ti.ticketId = t.id
      WHERE t.id = ?`;
  const [records] = await conn.query(sql, [id]);
  return records as AllTicketsWithImagesDAO;
};
