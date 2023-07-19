import { v4 } from "uuid";

import type { PoolConnection } from "mysql2/promise";
import type { UserRole } from "../domains";
import type { UserDAO, CreateClientUserDAO, CreateAdminUserDAO } from "../daos";

// get user by lineId
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

// get user by id
export type GetUserByIdFn = (
  conn: PoolConnection,
  userId: string
) => Promise<UserDAO | null>;
export const getUserById: GetUserByIdFn = async (conn, userId) => {
  const sql = `
    SELECT * FROM users
    WHERE id = ?`;
  const [records] = await conn.query(sql, [userId]);
  const users = records as UserDAO[];
  return users.length == 0 ? null : users[0];
};

// get user by username
export type GetUserByUsernameFn = (
  conn: PoolConnection,
  username: string
) => Promise<UserDAO | null>;
export const getUserByUsername: GetUserByUsernameFn = async (
  conn,
  username
) => {
  const sql = `
    SELECT * FROM users
    WHERE username = ?`;
  const [records] = await conn.query(sql, [username]);
  const users = records as UserDAO[];
  return users.length === 0 ? null : users[0];
};

// create client user
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

export type CreateAdminUserFn = (
  conn: PoolConnection,
  input: CreateAdminUserDAO
) => Promise<UserDAO | null>;
export const createAdminUser: CreateAdminUserFn = async (conn, input) => {
  const id = v4();
  const { username, password, role, cBy } = input;
  const now = new Date();

  const sql = `
    INSERT INTO users (
      id, 
      username, 
      password,
      role,
      cAt,
      cBy,
      uAt,
      uBy
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?
    )`;
  await conn.execute(sql, [id, username, password, role, now, cBy, now, cBy]);
  const mabyUser = await getUserById(conn, id);
  return mabyUser;
};
