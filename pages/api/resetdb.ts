import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dropTables = [
    "DROP TABLE IF EXISTS ticket_images;",
    "DROP TABLE IF EXISTS ticket_logs;",
    "DROP TABLE IF EXISTS tickets;",
    "DROP TABLE IF EXISTS users;",
    "DROP TABLE IF EXISTS issue_topics;",
  ];

  const pool = db.getDB();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const drops = dropTables.map((sql) => conn.execute(sql));
    const results = await Promise.allSettled(drops);
    const errs = results.filter((r) => r.status == "rejected");
    if (errs.length > 0) {
      await conn.rollback();
      return;
    }
    await conn.commit();

    res.status(200).json({ message: "reset db success." });
  } catch (err) {
    const dbErr = db.toDBError(err);
    res.status(500).json({ message: dbErr?.message });
  }
}
