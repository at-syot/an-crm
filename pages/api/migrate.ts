import { NextApiRequest, NextApiResponse } from "next";
import * as db from "../../src/database";

export default async function migrate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = db.getDB();
  const conn = await pool.getConnection();
  const createUserTblSQL = `
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) DEFAULT (uuid()),
        lineId VARCHAR(255) NOT NULL,
        phoneNo VARCHAR(20),
        active TINYINT DEFAULT 1,
        cAt DATETIME,

        PRIMARY KEY(id)
    )`;

  const createTicketTblSQL = `
    CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(36) DEFAULT (uuid()),
        name VARCHAR(255),
        detail VARCHAR(255),
        merchantName VARCHAR(255),
        currentStatus VARCHAR(50),
        active TINYINT DEFAULT 1,
        cAt DATETIME,
        cBy VARCHAR(255),
        uAt DATETIME,
        uBy VARCHAR(255),

        issueTopicId VARCHAR(36),
        userId VARCHAR(36),

        PRIMARY KEY(id),
        CONSTRAINT FK_userId FOREIGN KEY (userId)
            REFERENCES users(id),
        CONSTRAINT fk_ticket_issuetopic FOREIGN KEY (issueTopicId)
            REFERENCES issue_topics(id)
    )`;

  const createTicketLogsTblSQL = `
    CREATE TABLE IF NOT EXISTS ticket_logs (
        id int NOT NULL AUTO_INCREMENT,
        status VARCHAR(50),
        cBy VARCHAR(255),
        cAt DATETIME,

        ticketId VARCHAR(36),

        PRIMARY KEY(id),
        CONSTRAINT fk_ticketId FOREIGN KEY (ticketId)
            REFERENCES tickets(id)
    )`;

  const createTicketImagesTblSQL = `
    CREATE TABLE IF NOT EXISTS ticket_images (
        id INT NOT NULL AUTO_INCREMENT,
        uri VARCHAR(255),
        ticketId VARCHAR(36),
        cAt DATETIME,

        PRIMARY KEY(id),
        CONSTRAINT fk_ticketId_ticketImages FOREIGN KEY (ticketId)
            REFERENCES tickets(id)
    )`;

  const createIssueTopicsTblSQL = `
    CREATE TABLE IF NOT EXISTS issue_topics (
        id VARCHAR(36) DEFAULT (uuid()),
        name VARCHAR(255) NOT NULL,
        parentId VARCHAR(36),
        active TINYINT DEFAULT 1,

        PRIMARY KEY(id)
    )`;

  try {
    await conn.beginTransaction();
    const migrations = [
      createUserTblSQL,
      createIssueTopicsTblSQL,
      createTicketTblSQL,
      createTicketImagesTblSQL,
      createTicketLogsTblSQL,
    ].map((sql) => conn.execute(sql));
    const results = await Promise.allSettled(migrations);
    const errs = results.filter((r) => r.status == "rejected");
    if (errs.length > 0) {
      await conn.rollback();
      return;
    }
    await conn.commit();

    res.status(200).json({ message: "migrate success." });
  } catch (err) {
    const dbErr = db.toDBError(err);
    console.log(dbErr?.cause);
    console.log(dbErr?.message);

    res.status(500).json({ message: dbErr?.message });
  }
}
