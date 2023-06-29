import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../../src/api/database";

export default async function getTicketTopics(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pool = db.getDB();
    const conn = await pool.getConnection();
    const [records] = await conn.query("SELECT * FROM issue_topics");

    return res.status(200).json({ message: "", data: records });
  } catch (err) {
    const dbErr = db.toDBError(err);
    return res.status(500).json({ message: dbErr?.message });
  }
}
