import type { PoolConnection } from "mysql2/promise";
import { v4 } from "uuid";

import type {
  TicketCreateDAO,
  TicketWithImageDAO,
  AllTicketsWithImagesDAO,
  TicketDeleteDAO,
  UpdateTicketDAO,
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
    WHERE t.dAt is NULL
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

export type UpdateTicketByIdFn = (
  conn: PoolConnection,
  dao: UpdateTicketDAO
) => Promise<unknown>;
export const updateTicketById: UpdateTicketByIdFn = (conn, dao) => {
  const sql = `
    UPDATE tickets
    SET 
      name = ?,
      issueTopicId = ?,
      detail = ?,
      uAt = ?
      -- uBy = ?
    WHERE id = ?`;
  const { id, name, issueTopicId, detail } = dao;
  return conn.execute(sql, [name, issueTopicId, detail, new Date(), id]);
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
        ti.id as imageId,
	      ti.uri,
        it.id as issueId,
	      it.name as issueName
      FROM tickets t
      LEFT JOIN ticket_images ti ON ti.ticketId = t.id
      LEFT JOIN issue_topics it ON t.issueTopicId = it.id 
      WHERE t.id = ? AND t.dAt is NULL`;
  const [records] = await conn.query(sql, [id]);
  return records as AllTicketsWithImagesDAO;
};

export type DeleteTicketFn = (
  conn: PoolConnection,
  dao: TicketDeleteDAO
) => Promise<void>;
export const deleteTicket: DeleteTicketFn = async (conn, dao) => {
  const sql = `
    UPDATE tickets
    SET dAt = ?, dBy = ?
    WHERE id = ? AND userId = ?`;
  const values = [new Date(), dao.userId, dao.id, dao.userId];
  await conn.execute(sql, values);
};
