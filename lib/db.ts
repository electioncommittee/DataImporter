import DB from "mariadb";
require("dotenv").config();

export default class Pool {
  private pool: DB.Pool;
  constructor(multipleStatement = false) {
    this.pool = DB.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: multipleStatement,
    });
  }
  async query(sql: string, param?: any) {
    return await this.pool.query(sql, param);
  }
  async close() {
    return await this.pool.end();
  }
}
