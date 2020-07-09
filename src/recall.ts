import Pool from "../lib/db";
import { promises as fs } from "fs";
import ProgressBar from "progress";

type map = { [key: string]: number };

export default async function importRefData(
  pool: Pool,
  candMap: map,
  villMap: map
) {
  const DIR = "res/recall/";
  const files = await fs.readdir(DIR);
  for (const fileName of files) {
    const data = await fs.readFile(DIR + fileName, "utf8");
    const lines = data.split("\n").filter((e) => e);
    const year = parseInt(fileName.substr(3, 4));
    const candName = fileName.substr(7);
    const candId = candMap[candName];
    if (candId === undefined) {
      console.error(`找不到 ${candName} 罷免案候選人編號`);
      process.exit(-1);
    }
    const pgBar = new ProgressBar(
      `[:current/:total] Importing recall data (${year}/${candId}) [:bar] :rate/rps :eta`,
      {
        total: lines.length,
        complete: "+",
        incomplete: ".",
      }
    );
    for (const line of lines) {
      const tokens = line.split(",");
      const villId = villMap[tokens[0] + tokens[1] + tokens[2]];
      if (villId === undefined) {
        console.error(tokens[0] + tokens[1] + tokens[2]);
        process.exit(-1);
      }
      const consent = parseInt(tokens[3]);
      const against = parseInt(tokens[4]);
      const voidPoll = parseInt(tokens[5]);
      const voter = parseInt(tokens[6]);
      await pool.query(
        `
        INSERT INTO recalls (year, cand_id, vill_id, consent, against, void, voter)
        VALUES(?, ?, ?, ?, ?, ?, ?)
      `,
        [year, candId, villId, consent, against, voidPoll, voter]
      );
      pgBar.tick();
    }
  }
}
