import type { PoolConnection } from "mysql2/promise";
import type { UserDAO } from "../daos";

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
