import type { PoolConnection } from "mysql2/promise";
import type { CreateUserSessionDAO, UserSessionDAO } from "../daos";

export async function createUserSession(
  conn: PoolConnection,
  input: CreateUserSessionDAO
): Promise<void> {
  const { token, userId } = input;
  const sql = `
    INSERT INTO user_sessions (
      token, userId, cAt
    ) VALUES (?, ?, ?)`;
  await conn.execute(sql, [token, userId, new Date()]);
}

export async function findUserSessionBy(
  conn: PoolConnection,
  tokenOrUserId: string
): Promise<UserSessionDAO[]> {
  const sql = `
    SELECT * FROM user_sessions
    WHERE (userId = ? OR token = ?) AND dAt IS NULL`;
  const [records] = await conn.execute(sql, [tokenOrUserId, tokenOrUserId]);
  const userSessions = records as UserSessionDAO[];
  return userSessions;
}

export async function revokeUserSession(
  conn: PoolConnection,
  userId: string
): Promise<void> {
  const sql = `
    UPDATE user_sessions
    SET dAt = ?, active = 0
    WHERE userId = ?`;
  await conn.execute(sql, [new Date(), userId]);
}
