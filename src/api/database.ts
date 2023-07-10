import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";

import type { QueryError } from "mysql2";

let db: Pool;
let apianypayDB: Pool;

const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT ?? "0");
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_APIANYPAY = process.env.DB_APIANYPAY;
const DB_ANPCRM = process.env.DB_ANPCRM;

export const getDB = () => {
  if (db) {
    console.log("database[crm]: instance reused.");
    return db;
  }

  console.log("database[crm]: createPool");
  db = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_ANPCRM,
    waitForConnections: true,
    connectionLimit: 30,
    maxIdle: 10,
    enableKeepAlive: true,
  });

  return db;
};

export const getAPIAnypayDB = () => {
  if (apianypayDB) {
    console.log("database[apianpdb]: instance reused.");
    return apianypayDB;
  }

  console.log("database[apianpdb]: createPool");
  apianypayDB = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_APIANYPAY,
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
