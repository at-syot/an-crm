import type { PoolConnection } from "mysql2/promise";
import { ApiAnypayUserDAO } from "../daos";

export type GetUserByEmailAndPhoneNoFn = (
  conn: PoolConnection,
  email: string,
  phoneNo: string
) => Promise<ApiAnypayUserDAO | undefined>;
export const getUserByEmailAndPhoneNo: GetUserByEmailAndPhoneNoFn = async (
  conn,
  email,
  phoneNo
) => {
  const sql = `
      SELECT * FROM user
      WHERE u_email = ?
      AND (u_home_phone = ? OR u_mobile_phone = ?)
    `;
  const values = [email, phoneNo, phoneNo];
  const [users] = await conn.query(sql, values);
  const usersDao = users as ApiAnypayUserDAO[];
  if (usersDao.length == 0) return;
  return usersDao[0];
};
