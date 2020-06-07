import Pool from "../lib/db";
import { promises as fs } from "fs";

export default async function importSerial() {
  const pool = new Pool();

  const cityMap: { [key: string]: number } = {};
  const distMap: { [key: string]: number } = {};

  async function buildCityTable() {
    const cityTxt = await fs.readFile("res/serial/city", "utf8");
    const lines = cityTxt.split("\n").filter((e) => e);
    for (const line of lines) {
      const tokens = line.split(",");
      const name = tokens[0];
      const id = parseInt(tokens[1]);
      cityMap[name] = id;
      await pool.query("INSERT INTO cities (id, name) VALUES (?, ?)", [
        id,
        name,
      ]);
    }
  }

  async function buildDistTable() {
    const distTxt = await fs.readFile("res/serial/district", "utf8");
    const lines = distTxt.split("\n").filter((e) => e);
    for (const line of lines) {
      const tokens = line.split(",");
      const cityName = tokens[0];
      const name = tokens[1];
      const id = parseInt(tokens[2]);
      distMap[cityName + name] = id;
      await pool.query(
        "INSERT INTO districts (id, name, city) VALUES (?, ?, ?)",
        [id, name, cityMap[cityName]]
      );
    }
  }

  async function buildVillTable() {
    const distTxt = await fs.readFile("res/serial/village", "utf8");
    const lines = distTxt.split("\n").filter(e=>e);
    for(const line of lines) {
      const tokens = line.split(",");
      const cityName = tokens[0];
      const distName = tokens[1];
      const name = tokens[2];
      const id = parseInt(tokens[3]);
      await pool.query(
        "INSERT INTO villages (id, name, dist) VALUES (?, ?, ?)",
        [id, name, distMap[cityName + distName]]
      );
    };
  }

  async function buildPartyTable() {}

  async function buildCandTable() {}

  await buildCityTable();
  await buildDistTable();
  await buildVillTable();
  pool.close();
}
