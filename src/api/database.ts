import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";

import type { QueryError } from "mysql2";

let db: Pool;
let apianypayDB: Pool;

const DB_HOST = "anypay-db-tmp.cbkm16y0krx6.ap-southeast-1.rds.amazonaws.com";
const DB_USER = "root";
const DB_PASSWORD = "XReBXQka9wwFYnUlz8Uv";

export const getDB = () => {
  if (db) {
    console.log("database[crm]: instance reused.");
    return db;
  }

  console.log("database[ctm]: createPool");
  db = mysql.createPool({
    host: DB_HOST,
    port: 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "anp_crm",
    waitForConnections: true,
    connectionLimit: 30,
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
    host: DB_HOST,
    port: 3306,
    user: DB_USER,
    password: DB_PASSWORD,
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
