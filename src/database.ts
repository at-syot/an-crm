import * as mysql2 from "mysql2";
import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";

import type { QueryError } from "mysql2";

let db: Pool;
let apianypayDB: Pool;
export const getDB = () => {
  if (db) {
    console.log("database[crm]: instance reused.");
    return db;
  }

  console.log("database[ctm]: createPool");
  db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "anpcrm",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    enableKeepAlive: true,
  });

  return db;
};

export const getAPIAnypayDB = () => {
  if (apianypayDB) {
    return apianypayDB;
  }

  apianypayDB = mysql.createPool({
    host: "anypay-db-tmp.cbkm16y0krx6.ap-southeast-1.rds.amazonaws.com",
    port: 3306,
    user: "root",
    password: "XReBXQka9wwFYnUlz8Uv",
    database: "apianypay_db",
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
  });
  return apianypayDB;
};

type ToDBErrorFn = (err: any) => QueryError | null;
export const toDBError: ToDBErrorFn = (err) => {
  const unknownErr = err as unknown;
  return unknownErr as QueryError | null;
};
