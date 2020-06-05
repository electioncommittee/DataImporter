import DB from "mariadb";
require("dotenv").config();

export default class Pool {
  private pool: DB.Pool;
  constructor() {
    this.pool = DB.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }
  query(sql: string, param?: string[]) {
    return this.pool.query(sql, param);
  }
  close() {
    return this.pool.end();
  }
}
