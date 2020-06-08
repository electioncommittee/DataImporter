import Pool from "../lib/db";
import {
  importAreaSerialData,
  importCandidateSerialData,
  importPartySerialData,
} from "./serial";
import importCandidateData from "./candidate";
import importPollData from "./poll";
import importRefData from "./referendum";

async function buildTables() {
  const pool = new Pool(true);
  console.log("Building tables");
  await pool.query(`
    CREATE TABLE \`candidates\` (
    \`id\` smallint NOT NULL,
    \`name\` varchar(64) NOT NULL
    );

    CREATE TABLE \`cities\` (
    \`id\` tinyint NOT NULL,
    \`name\` varchar(16) NOT NULL
    );

    CREATE TABLE \`districts\` (
    \`id\` smallint NOT NULL,
    \`name\` varchar(32) NOT NULL,
    \`city\` tinyint NOT NULL
    );

    CREATE TABLE \`legislator_at_large_candidates\` (
    \`year\` smallint NOT NULL,
    \`no\` tinyint NOT NULL,
    \`party_id\` smallint NOT NULL
    );

    CREATE TABLE \`legislator_at_large_polls\` (
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL,
    \`no\` tinyint NOT NULL,
    \`poll\` int NOT NULL
    );

    CREATE TABLE \`legislator_at_large_voters\` (
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL,
    \`voter\` int NOT NULL
    );

    CREATE TABLE \`legislator_candidates\` (
    \`cand_id\` smallint NOT NULL,
    \`year\` smallint NOT NULL,
    \`cst\` int NOT NULL,
    \`no\` smallint NOT NULL,
    \`party_id\` smallint NOT NULL
    );

    CREATE TABLE \`legislator_constituencies\` (
    \`vill_id\` int NOT NULL,
    \`year\` smallint NOT NULL,
    \`constituency\` int NOT NULL
    );

    CREATE TABLE \`legislator_polls\` (
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL,
    \`no\` smallint NOT NULL,
    \`poll\` int NOT NULL
    );

    CREATE TABLE \`legislator_voters\` (
    \`voter\` int NOT NULL,
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL
    );

    CREATE TABLE \`local_candidates\` (
    \`year\` smallint NOT NULL,
    \`no\` tinyint NOT NULL,
    \`party_id\` smallint NOT NULL,
    \`cand_id\` smallint NOT NULL,
    \`city_id\` tinyint NOT NULL
    );

    CREATE TABLE \`local_polls\` (
    \`year\` smallint NOT NULL,
    \`poll\` int NOT NULL,
    \`vill_id\` int NOT NULL,
    \`no\` tinyint NOT NULL
    );

    CREATE TABLE \`local_voters\` (
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL,
    \`voter\` int NOT NULL
    );

    CREATE TABLE \`parties\` (
    \`id\` smallint NOT NULL,
    \`name\` varchar(96) NOT NULL
    );

    CREATE TABLE \`president_candidates\` (
    \`year\` smallint NOT NULL,
    \`cand_id\` smallint NOT NULL,
    \`vice_cand_id\` smallint NOT NULL,
    \`no\` tinyint NOT NULL,
    \`party_id\` smallint NOT NULL
    );

    CREATE TABLE \`president_polls\` (
    \`no\` tinyint NOT NULL,
    \`poll\` int NOT NULL,
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL
    );

    CREATE TABLE \`president_voters\` (
    \`year\` smallint NOT NULL,
    \`voter\` int NOT NULL,
    \`vill_id\` int NOT NULL
    );

    CREATE TABLE \`recall_candidtates\` (
    \`cand_id\` smallint NOT NULL,
    \`year\` smallint NOT NULL,
    \`position\` varchar(24) NOT NULL
    );

    CREATE TABLE \`recall_polls\` (
    \`cand_id\` smallint NOT NULL,
    \`polls\` int NOT NULL,
    \`year\` smallint NOT NULL,
    \`vill_id\` int NOT NULL
    );

    CREATE TABLE \`referendums\` (
    \`ref_case\` tinyint NOT NULL,
    \`vill_id\` int NOT NULL,
    \`consent\` int NOT NULL,
    \`against\` int NOT NULL,
    \`void\` int NOT NULL,
    \`voter\` int NOT NULL
    );

    CREATE TABLE \`villages\` (
    \`id\` int NOT NULL,
    \`name\` varchar(32) NOT NULL,
    \`dist\` smallint NOT NULL
    );

    ALTER TABLE \`candidates\`
    ADD PRIMARY KEY (\`id\`);

    ALTER TABLE \`cities\`
    ADD PRIMARY KEY (\`id\`),
    ADD UNIQUE KEY \`name\` (\`name\`);

    ALTER TABLE \`districts\`
    ADD PRIMARY KEY (\`id\`),
    ADD UNIQUE KEY \`name\` (\`name\`,\`city\`),
    ADD KEY \`city\` (\`city\`);

    ALTER TABLE \`legislator_at_large_candidates\`
    ADD PRIMARY KEY (\`year\`,\`no\`),
    ADD UNIQUE KEY \`year_party\` (\`year\`,\`party_id\`),
    ADD KEY \`party_id\` (\`party_id\`);

    ALTER TABLE \`legislator_at_large_polls\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`,\`no\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`legislator_at_large_voters\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`);

    ALTER TABLE \`legislator_candidates\`
    ADD PRIMARY KEY (\`year\`,\`cst\`,\`no\`),
    ADD UNIQUE KEY \`year_cand\` (\`cand_id\`,\`year\`),
    ADD KEY \`cand_id\` (\`cand_id\`),
    ADD KEY \`party_id\` (\`party_id\`);

    ALTER TABLE \`legislator_constituencies\`
    ADD PRIMARY KEY (\`vill_id\`,\`year\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`legislator_polls\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`,\`no\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`legislator_voters\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`local_candidates\`
    ADD PRIMARY KEY (\`year\`,\`no\`,\`city_id\`),
    ADD UNIQUE KEY \`year_cand\` (\`year\`,\`cand_id\`),
    ADD KEY \`city_id\` (\`city_id\`),
    ADD KEY \`party_id\` (\`party_id\`),
    ADD KEY \`cand_id\` (\`cand_id\`);

    ALTER TABLE \`local_polls\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`,\`no\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`local_voters\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`parties\`
    ADD PRIMARY KEY (\`id\`),
    ADD UNIQUE KEY \`name\` (\`name\`);

    ALTER TABLE \`president_candidates\`
    ADD PRIMARY KEY (\`year\`,\`no\`),
    ADD UNIQUE KEY \`year_cand\` (\`year\`,\`cand_id\`),
    ADD UNIQUE KEY \`year_vice\` (\`year\`,\`vice_cand_id\`),
    ADD UNIQUE KEY \`year_party\` (\`year\`,\`party_id\`),
    ADD KEY \`cand_id\` (\`cand_id\`),
    ADD KEY \`party_id\` (\`party_id\`),
    ADD KEY \`vice_cand_id\` (\`vice_cand_id\`);

    ALTER TABLE \`president_polls\`
    ADD PRIMARY KEY (\`vill_id\`,\`year\`,\`no\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`president_voters\`
    ADD PRIMARY KEY (\`year\`,\`vill_id\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`recall_candidtates\`
    ADD PRIMARY KEY (\`year\`,\`cand_id\`),
    ADD KEY \`cand_id\` (\`cand_id\`);

    ALTER TABLE \`recall_polls\`
    ADD PRIMARY KEY (\`cand_id\`,\`year\`,\`vill_id\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`referendums\`
    ADD PRIMARY KEY (\`ref_case\`,\`vill_id\`),
    ADD KEY \`vill_id\` (\`vill_id\`);

    ALTER TABLE \`villages\`
    ADD PRIMARY KEY (\`id\`),
    ADD UNIQUE KEY \`name\` (\`name\`,\`dist\`),
    ADD KEY \`dist\` (\`dist\`);

    ALTER TABLE \`candidates\`
    MODIFY \`id\` smallint NOT NULL AUTO_INCREMENT;

    ALTER TABLE \`parties\`
    MODIFY \`id\` smallint NOT NULL AUTO_INCREMENT;

    ALTER TABLE \`districts\`
    ADD CONSTRAINT \`districts_ibfk_1\` FOREIGN KEY (\`city\`) REFERENCES \`cities\` (\`id\`);

    ALTER TABLE \`legislator_at_large_candidates\`
    ADD CONSTRAINT \`legislator_at_large_candidates_ibfk_1\` FOREIGN KEY (\`party_id\`) REFERENCES \`parties\` (\`id\`);

    ALTER TABLE \`legislator_at_large_polls\`
    ADD CONSTRAINT \`legislator_at_large_polls_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`legislator_polls\`
    ADD CONSTRAINT \`legislator_polls_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`legislator_voters\`
    ADD CONSTRAINT \`legislator_voters_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`local_candidates\`
    ADD CONSTRAINT \`local_candidates_ibfk_1\` FOREIGN KEY (\`city_id\`) REFERENCES \`cities\` (\`id\`),
    ADD CONSTRAINT \`local_candidates_ibfk_3\` FOREIGN KEY (\`cand_id\`) REFERENCES \`candidates\` (\`id\`),
    ADD CONSTRAINT \`local_candidates_ibfk_4\` FOREIGN KEY (\`party_id\`) REFERENCES \`parties\` (\`id\`);

    ALTER TABLE \`local_polls\`
    ADD CONSTRAINT \`local_polls_ibfk_2\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`local_voters\`
    ADD CONSTRAINT \`local_voters_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`president_candidates\`
    ADD CONSTRAINT \`president_candidates_ibfk_1\` FOREIGN KEY (\`cand_id\`) REFERENCES \`candidates\` (\`id\`),
    ADD CONSTRAINT \`president_candidates_ibfk_2\` FOREIGN KEY (\`party_id\`) REFERENCES \`parties\` (\`id\`),
    ADD CONSTRAINT \`president_candidates_ibfk_3\` FOREIGN KEY (\`vice_cand_id\`) REFERENCES \`candidates\` (\`id\`);

    ALTER TABLE \`president_polls\`
    ADD CONSTRAINT \`president_polls_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`president_voters\`
    ADD CONSTRAINT \`president_voters_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`recall_candidtates\`
    ADD CONSTRAINT \`recall_candidtates_ibfk_1\` FOREIGN KEY (\`cand_id\`) REFERENCES \`candidates\` (\`id\`);

    ALTER TABLE \`recall_polls\`
    ADD CONSTRAINT \`recall_polls_ibfk_1\` FOREIGN KEY (\`cand_id\`) REFERENCES \`candidates\` (\`id\`),
    ADD CONSTRAINT \`recall_polls_ibfk_2\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`referendums\`
    ADD CONSTRAINT \`referendums_ibfk_1\` FOREIGN KEY (\`vill_id\`) REFERENCES \`villages\` (\`id\`);

    ALTER TABLE \`villages\`
    ADD CONSTRAINT \`villages_ibfk_1\` FOREIGN KEY (\`dist\`) REFERENCES \`districts\` (\`id\`);
    `);
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
    console.log("Completed.");
  } catch (e) {
    console.error(e);
  }
  await pool.query(`SET UNIQUE_CHECKS=1;`);
  await pool.query(`SET FOREIGN_KEY_CHECKS=1;`);
  pool.close();
}

run();
