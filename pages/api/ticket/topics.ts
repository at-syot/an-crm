import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/database";

export default async function getTicketTopics(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pool = db.getDB();
    const conn = await pool.getConnection();

    const [records] = await conn.query("SELECT * FROM issue_topics");
    res.status(200).json(records);
  } catch (err) {
    const dbErr = db.toDBError(err);
    return res.status(500).json({ message: dbErr?.message });
  }
}
