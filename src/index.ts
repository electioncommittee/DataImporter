import Pool from "../lib/db";
import {
  importAreaSerialData,
  importCandidateSerialData,
  importPartySerialData,
} from "./serial";
import importCandidateData from "./candidate";
import importPollData from "./poll";
import importRefData from "./referendum";
import importRecallData from "./recall";
import fs from "fs";

async function buildTables() {
  const pool = new Pool(true);
  console.log("Building tables");
  const sql = fs.readFileSync("src/create_table.sql", "utf-8");
  await pool.query(sql);
  pool.close();
}

async function run() {
  const pool = new Pool();
  try {
    await buildTables();
    await pool.query(`SET UNIQUE_CHECKS=0;`);
    await pool.query(`SET FOREIGN_KEY_CHECKS=0;`);
    const [cityMap, distMap, villMap] = await importAreaSerialData(pool);
    const candMap = await importCandidateSerialData(pool);
    const partyMap = await importPartySerialData(pool);
    await importCandidateData(pool, cityMap, partyMap, candMap);
    await importPollData(pool, cityMap, villMap);
    await importRefData(pool, villMap);
    await importRecallData(pool, candMap, villMap);
    console.log("Completed.");
  } catch (e) {
    console.error(e);
  }
  await pool.query(`SET UNIQUE_CHECKS=1;`);
  await pool.query(`SET FOREIGN_KEY_CHECKS=1;`);
  pool.close();
}

run();
