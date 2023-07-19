import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../src/api/database";
import { PoolConnection } from "mysql2/promise";
import { CreateAdminUserDAO } from "../../src/data.types";
import { hashPlainPassword } from "../../src/utils/encryption";
import * as userRepo from "../../src/api/repositories/users";

export default async function seed(req: NextApiRequest, res: NextApiResponse) {
  const pool = db.getDB();
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const seedIssueTopicAwaits = seedIssueTopics(conn);
    const seedSystemUserAwaits = await seedSystemUser(conn);

    const results = await Promise.allSettled([
      ...seedIssueTopicAwaits,
      ...seedSystemUserAwaits,
    ]);
    const errs = results.filter((r) => r.status == "rejected");
    if (errs.length > 0) {
      await conn.rollback();
      return res.status(500).json({ message: "seed data error" });
    }
    await conn.commit();

    res.status(200).json({ message: "seed data" });
  } catch (err) {
    console.log("api/seed err", err);

    await conn.rollback();
    res.status(500).send({});
  }
}

function seedIssueTopics(conn: PoolConnection) {
  const seeders: Promise<unknown>[] = [
    conn.execute("DELETE FROM issue_topics;"),
  ];
  [
    `INSERT INTO issue_topics(name) VALUES ('Scan QR: not receive money');`,
    `INSERT INTO issue_topics(name) VALUES ('Scan QR: fails');`,
    `INSERT INTO issue_topics(name) VALUES ('Scan QR: not response')`,
    `INSERT INTO issue_topics(name) VALUES ('Not match information')`,
    `INSERT INTO issue_topics(name) VALUES ('Invalid information')`,
    `INSERT INTO issue_topics(name) VALUES ('System fails')`,
    `INSERT INTO issue_topics(name) VALUES ('System login fails')`,
    `INSERT INTO issue_topics(name) VALUES ('Etc..')`,
  ].forEach((sql) => seeders.push(conn.execute(sql)));
  return seeders;
}

async function seedSystemUser(conn: PoolConnection) {
  const username = "system-user";
  const password = "sysuser4321";
  const hashed = await hashPlainPassword(password);
  const input = {
    username,
    password: hashed,
    role: "system",
    cBy: "system",
  } satisfies CreateAdminUserDAO;
  return [userRepo.createAdminUser(conn, input)];
}
