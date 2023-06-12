import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = db.getDB();
  const conn = await pool.getConnection();
  try {
    const result = await conn.execute("SELECT * FROM sys_config");
    console.log(result);
  } catch (err) {
    const dbErr = db.toDBError(err);
    res.status(500).send({ message: dbErr?.message });
  }
}
