import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../src/database";

export default async function seed(req: NextApiRequest, res: NextApiResponse) {
  const pool = db.getDB();
  const conn = await pool.getConnection();

  await conn.beginTransaction();
  try {
    await conn.execute("DELETE FROM issue_topics;");
    const sqls = [
      `INSERT INTO issue_topics(name) VALUES ('Scan QR: not receive money');`,
      `INSERT INTO issue_topics(name) VALUES ('Scan QR: fails');`,
      `INSERT INTO issue_topics(name) VALUES ('Scan QR: not response')`,
      `INSERT INTO issue_topics(name) VALUES ('Not match information')`,
      `INSERT INTO issue_topics(name) VALUES ('Invalid information')`,
      `INSERT INTO issue_topics(name) VALUES ('System fails')`,
      `INSERT INTO issue_topics(name) VALUES ('System login fails')`,
      `INSERT INTO issue_topics(name) VALUES ('Etc..')`,
    ];
    const results = await Promise.allSettled(
      sqls.map((sql) => conn.execute(sql))
    );
    const errs = results.filter(({ status }) => status == "rejected");

    if (errs.length > 0) {
      await conn.rollback();
      return res.status(500).json({ message: "seed data error" });
    }
    await conn.commit();

    res.status(200).json({ message: "seed data" });
  } catch (err) {
    console.log("err -----", err);
    await conn.rollback();

    res.status(500).send({});
  }
}
