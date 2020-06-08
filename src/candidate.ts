import Pool from "../lib/db";
import { promises as fs } from "fs";
import ProgressBar from "progress";

type map = { [key: string]: number };

export default async function importCandidateData(
  pool: Pool,
  cityMap: map,
  partyMap: map,
  candMap: map
) {
  function party(p: string): number {
    if (p == "NULL") return -1;
    return partyMap[p];
  }

  async function importLegAtLarData(year: number, tokens: string[]) {
    await pool.query(
      `
        INSERT INTO legislator_at_large_candidates (year, no, party_id)
        VALUES (?, ?, ?)
      `,
      [year, parseInt(tokens[1]), party(tokens[0])]
    );
  }

  async function importLegData(year: number, tokens: string[]) {
    const cityId = cityMap[tokens[0]];
    const cst = cityId * 100 + parseInt(tokens[1]);
    await pool.query(
      `
        INSERT INTO legislator_candidates (cand_id, year, cst, no, party_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      [candMap[tokens[2]], year, cst, parseInt(tokens[3]), party(tokens[4])]
    );
  }

  async function importPsdData(year: number, tokens: string[]) {
    const psdId = candMap[tokens[0]],
      viceId = candMap[tokens[1]],
      no = parseInt(tokens[2]),
      partyId = party(tokens[3]);
    await pool.query(
      `
        INSERT INTO president_candidates (year, cand_id, vice_cand_id, no, party_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      [year, psdId, viceId, no, partyId]
    );
  }

  async function importLocalData(year: number, tokens: string[]) {
    const cityId = cityMap[tokens[0]],
      candId = candMap[tokens[1]],
      no = parseInt(tokens[2]),
      partyId = party(tokens[3]);
    await pool.query(
      `
        INSERT INTO local_candidates (year, no, party_id, cand_id, city_id)
        VALUES (?, ?, ?, ?, ?)
    `,
      [year, no, partyId, candId, cityId]
    );
  }

  const DIR = "res/cand/";
  const files = await fs.readdir(DIR);
  for (const fileName of files) {
    let func: (year: number, tokens: string[]) => Promise<void>;
    let title: string;
    if (fileName.startsWith("lal")) {
      func = importLegAtLarData;
      title = "legislator at large";
    } else if (fileName.startsWith("lcl")) {
      func = importLocalData;
      title = "local";
    } else if (fileName.startsWith("psd")) {
      func = importPsdData;
      title = "president";
    } else if (fileName.startsWith("leg")) {
      func = importLegData;
      title = "legislator";
    }

    const data = await fs.readFile(DIR + fileName, "utf8");
    const lines = data.split("\n").filter((e) => e);
    const year = parseInt(fileName.substr(fileName.length - 4));
    const pgBar = new ProgressBar(
      `[:current/:total] Importing ${title} candidate data (${year}) [:bar] :rate/rps :eta`,
      {
        total: lines.length,
        complete: "+",
        incomplete: ".",
      }
    );
    for (const line of lines) {
      await func(year, line.split(","));
      pgBar.tick();
    }
  }
}
