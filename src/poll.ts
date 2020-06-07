import Pool from "../lib/db";
import { promises as fs } from "fs";

type map = { [key: string]: number };

export async function importLegCstData(pool: Pool, cityMap: map, villMap: map) {
  const DIR = "res/legcst/";
  const files = await fs.readdir(DIR);
  for (const fileName of files) {
    const data = await fs.readFile(DIR + fileName, "utf8");
    const lines = data.split("\n").filter((e) => e);
    const year = parseInt(fileName.substr(fileName.length - 4));
    console.log(`Importing legislator constituency data (${year}).`);
    for (const line of lines) {
      const tokens = line.split(",");
      const villId = villMap[tokens[0] + tokens[1] + tokens[2]];
      const cstId = cityMap[tokens[3]] * 100 + parseInt(tokens[4]);
      await pool.query(
        `
        INSERT INTO legislator_constituencies (vill_id, year, constituency)
        VALUES (?, ?, ?)
      `,
        [villId, year, cstId]
      );
    }
  }
}

async function importPollData(pool: Pool, villMap: map) {
  const DIR = "res/poll/";
  const files = await fs.readdir(DIR);

  async function importData(
    year: number,
    tableName: string,
    villId: number,
    polls: number[],
    voidPoll: number,
    voters: number
  ) {
    for (let i = 0; i < polls.length; i++) {
      await pool.query(
        `
        INSERT INTO ${tableName}_polls (year, vill_id, no, poll)
        VALUES (?, ?, ?, ?)
      `,
        [year, villId, i + 1, polls[i]]
      );
    }
    await pool.query(
      `
        INSERT INTO ${tableName}_polls (year, vill_id, no, poll)
        VALUES (?, ?, ?, ?)
      `,
      [year, villId, -1, voidPoll]
    );
    await pool.query(
      `
        INSERT INTO ${tableName}_voters (year, vill_id, voter)
        VALUES (?, ?, ?)
    `,
      [year, villId, voters]
    );
  }

  for (const fileName of files) {
    const data = await fs.readFile(DIR + fileName, "utf8");
    const lines = data.split("\n").filter((e) => e);
    const year = parseInt(fileName.substr(fileName.length - 4));
    if (fileName.startsWith("lal"))
      console.log(`Importing legislator at large data (${year}).`);
    else if (fileName.startsWith("lcl"))
      console.log(`Importing local data (${year}).`);
    else if (fileName.startsWith("leg"))
      console.log(`Importing legislator data (${year}).`);
    else if (fileName.startsWith("psd"))
      console.log(`Importing president data (${year}).`);
    for (const line of lines) {
      const tokens = line.split(",");
      const villId = villMap[tokens[0] + tokens[1] + tokens[2]];
      const polls = tokens.slice(3, tokens.length - 2).map((e) => parseInt(e));
      const voidPoll = parseInt(tokens[tokens.length - 2]);
      const voters = parseInt(tokens[tokens.length - 1]);
      let tableName: string;
      if (fileName.startsWith("lal")) tableName = "legislator_at_large";
      else if (fileName.startsWith("leg")) tableName = "legislator";
      else if (fileName.startsWith("psd")) tableName = "president";
      else if (fileName.startsWith("lcl")) tableName = "local";
      await importData(year, tableName, villId, polls, voidPoll, voters);
    }
  }
}

export default async function importMainData(
  pool: Pool,
  cityMap: map,
  villMap: map
) {
  await importLegCstData(pool, cityMap, villMap);
  await importPollData(pool, villMap);
}
