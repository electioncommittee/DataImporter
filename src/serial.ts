import Pool from "../lib/db";
import { promises as fs } from "fs";
import ProgressBar from "progress";

export async function importAreaSerialData(pool: Pool) {
  const cityMap: { [key: string]: number } = {};
  const distMap: { [key: string]: number } = {};
  const villMap: { [key: string]: number } = {};

  async function importCityData() {
    const cityTxt = await fs.readFile("res/serial/city", "utf8");
    const lines = cityTxt.split("\n").filter((e) => e);
    const pgBar = new ProgressBar(
      "[:current/:total] Importing city serial data [:bar] :rate/rps :eta",
      {
        total: lines.length,
        complete: "+",
        incomplete: ".",
      }
    );

    for (const line of lines) {
      const tokens = line.split(",");
      const cityName = tokens[0];
      const id = parseInt(tokens[1]);
      cityMap[cityName] = id;
      await pool.query("INSERT INTO cities (id, name) VALUES (?, ?)", [
        id,
        cityName,
      ]);
      pgBar.tick();
    }
  }

  async function importDistData() {
    const distTxt = await fs.readFile("res/serial/district", "utf8");
    const lines = distTxt.split("\n").filter((e) => e);
    const pgBar = new ProgressBar(
      "[:current/:total] Importing district serial data [:bar] :rate/rps :eta",
      {
        total: lines.length,
        complete: "+",
        incomplete: ".",
      }
    );

    for (const line of lines) {
      const tokens = line.split(",");
      const cityName = tokens[0];
      const distName = tokens[1];
      const id = parseInt(tokens[2]);
      distMap[cityName + distName] = id;
      await pool.query(
        "INSERT INTO districts (id, name, city) VALUES (?, ?, ?)",
        [id, distName, cityMap[cityName]]
      );
      pgBar.tick();
    }
  }

  async function importVillData() {
    const distTxt = await fs.readFile("res/serial/village", "utf8");
    const lines = distTxt.split("\n").filter((e) => e);
    const pgBar = new ProgressBar(
      "[:current/:total] Importing village serial data [:bar] :rate/rps :eta",
      {
        total: lines.length,
        complete: "+",
        incomplete: ".",
      }
    );

    for (const line of lines) {
      const tokens = line.split(",");
      const cityName = tokens[0];
      const distName = tokens[1];
      const villName = tokens[2];
      const id = parseInt(tokens[3]);
      villMap[cityName + distName + villName] = id;
      await pool.query(
        "INSERT INTO villages (id, name, dist) VALUES (?, ?, ?)",
        [id, villName, distMap[cityName + distName]]
      );
      pgBar.tick();
    }
  }

  await importCityData();
  await importDistData();
  await importVillData();

  return [cityMap, distMap, villMap];
}

export async function importCandidateSerialData(pool: Pool) {
  const candMap: { [key: string]: number } = {};
  const candTxt = await fs.readFile("res/serial/candidate", "utf8");
  const lines = candTxt.split("\n").filter((e) => e);
  const pgBar = new ProgressBar(
    "[:current/:total] Importing candidate serial data [:bar] :rate/rps :eta",
    {
      total: lines.length,
      complete: "+",
      incomplete: ".",
    }
  );

  for (const line of lines) {
    const tokens = line.split(",");
    const name = tokens[0];
    const id = parseInt(tokens[1]);
    candMap[name] = id;
    await pool.query("INSERT INTO candidates (name, id) VALUES (?, ?)", [
      name,
      id,
    ]);
    pgBar.tick();
  }

  return candMap;
}

export async function importPartySerialData(pool: Pool) {
  const partyMap: { [key: string]: number } = {};
  const candTxt = await fs.readFile("res/serial/party", "utf8");
  const lines = candTxt.split("\n").filter((e) => e);
  const pgBar = new ProgressBar(
    "[:current/:total] Importing party serial data [:bar] :rate/rps :eta",
    {
      total: lines.length,
      complete: "+",
      incomplete: ".",
    }
  );

  for (const line of lines) {
    const tokens = line.split(",");
    const name = tokens[0];
    const id = parseInt(tokens[1]);
    partyMap[name] = id;
    await pool.query("INSERT INTO parties (name, id) VALUES (?, ?)", [
      name,
      id,
    ]);
    pgBar.tick();
  }

  await pool.query("INSERT INTO parties (name, id) VALUES ('', -1)");
  return partyMap;
}
