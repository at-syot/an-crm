import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../src/database";

export default async function tickets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = db.getDB();

  try {
    const conn = await pool.getConnection();
    const [tickets] = await conn.query("SELECT * FROM tickets;");

    res.json(tickets);
  } catch (err) {
    console.log("err--------", err);
    return res.status(500).send({});
  }
}
