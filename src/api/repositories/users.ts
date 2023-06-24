import { v4 } from "uuid";

import type { PoolConnection } from "mysql2/promise";
import type { UserDAO, CreateUserDAO } from "../daos";

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

export type CreateUserFn = (
  conn: PoolConnection,
  dao: CreateUserDAO
) => Promise<void>;
export const createUser: CreateUserFn = async (conn, dao) => {
  const sql = `
    INSERT INTO users(
      id,
      lineId,
      phoneNo
    ) VALUES (?, ?, ?)`;
  await conn.execute(sql, [v4(), dao.lineId, dao.phoneNo]);
};
