import Pool from "../lib/db";
import { promises as fs } from "fs";
import ProgressBar from "progress";

type map = { [key: string]: number };

export default async function importRefData(pool: Pool, villMap: map) {
  const DIR = "res/ref/";
  const files = await fs.readdir(DIR);
  for (const fileName of files) {
    const data = await fs.readFile(DIR + fileName, "utf8");
    const lines = data.split("\n").filter((e) => e);
    const refCase = parseInt(fileName.substr(4));
    const pgBar = new ProgressBar(
      `[:current/:total] Importing referendum data (Case ${refCase}) [:bar] :rate/rps :eta`,
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
      const voters = parseInt(tokens[3]);
      const consent = parseInt(tokens[4]);
      const against = parseInt(tokens[5]);
      const voidPoll = parseInt(tokens[6]);
      await pool.query(
        `
        INSERT INTO referendums (ref_case, vill_id, consent, against, void, voter)
        VALUES(?, ?, ?, ?, ?, ?)
      `,
        [refCase, villId, consent, against, voidPoll, voters]
      );
      pgBar.tick();
    }
  }
}
