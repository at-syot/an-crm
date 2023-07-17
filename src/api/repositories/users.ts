import { v4 } from "uuid";

import type { PoolConnection } from "mysql2/promise";
import type { UserRole } from "../domains";
import type { UserDAO, CreateClientUserDAO } from "../daos";

export type GetUserByLineIdFn = (
  conn: PoolConnection,
  lineId: string
) => Promise<UserDAO | undefined>;
export const getUserByLineId: GetUserByLineIdFn = async (conn, lineId) => {
  const sql = `
    SELECT * FROM users 
    WHERE lineId = ?`;
  const [users] = await conn.query(sql, [lineId]);
  const userDaos = users as UserDAO[];
  if (userDaos.length == 0) return;
  return userDaos[0];
};

export type CreateClientUserFn = (
  conn: PoolConnection,
  dao: CreateClientUserDAO
) => Promise<void>;
export const createClientUser: CreateClientUserFn = async (conn, dao) => {
  const clientRole: UserRole = "client";
  const sql = `
    INSERT INTO users(
      id,
      lineId,
      phoneNo,
      role
    ) VALUES (?, ?, ?, ?)`;
  await conn.execute(sql, [v4(), dao.lineId, dao.phoneNo, clientRole]);
};
