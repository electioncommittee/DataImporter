SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

CREATE TABLE candidates (
  id smallint(6) NOT NULL AUTO_INCREMENT,
  name varchar(64) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE cities (
  id tinyint(4) NOT NULL,
  name varchar(16) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
);

CREATE TABLE districts (
  id smallint(6) NOT NULL,
  name varchar(32) NOT NULL,
  city tinyint(4) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name,city),
  KEY city (city)
);

CREATE TABLE legislator_at_large_candidates (
  year smallint(6) NOT NULL,
  no tinyint(4) NOT NULL,
  party_id smallint(6) NOT NULL,
  PRIMARY KEY (year,no),
  UNIQUE KEY year_party (year,party_id),
  KEY party_id (party_id)
);

CREATE TABLE legislator_at_large_polls (
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  no tinyint(4) NOT NULL,
  poll int(11) NOT NULL,
  PRIMARY KEY (year,vill_id,no),
  KEY vill_id (vill_id)
);

CREATE TABLE legislator_at_large_voters (
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  voter int(11) NOT NULL,
  PRIMARY KEY (year,vill_id)
);

CREATE TABLE legislator_candidates (
  cand_id smallint(6) NOT NULL,
  year smallint(6) NOT NULL,
  cst smallint(6) NOT NULL,
  no smallint(6) NOT NULL,
  party_id smallint(6) NOT NULL,
  PRIMARY KEY (year,cst,no),
  UNIQUE KEY year_cand (cand_id,year),
  KEY cand_id (cand_id),
  KEY party_id (party_id)
);

CREATE TABLE legislator_constituencies (
  vill_id int(11) NOT NULL,
  year smallint(6) NOT NULL,
  cst smallint(6) NOT NULL,
  PRIMARY KEY (vill_id,year),
  KEY vill_id (vill_id)
);

CREATE TABLE legislator_polls (
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  no smallint(6) NOT NULL,
  poll int(11) NOT NULL,
  PRIMARY KEY (year,vill_id,no),
  KEY vill_id (vill_id)
);

CREATE TABLE legislator_voters (
  voter int(11) NOT NULL,
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  PRIMARY KEY (year,vill_id),
  KEY vill_id (vill_id)
);

CREATE TABLE local_candidates (
  year smallint(6) NOT NULL,
  no tinyint(4) NOT NULL,
  party_id smallint(6) NOT NULL,
  cand_id smallint(6) NOT NULL,
  city_id tinyint(4) NOT NULL,
  PRIMARY KEY (year,no,city_id),
  UNIQUE KEY year_cand (year,cand_id),
  KEY city_id (city_id),
  KEY party_id (party_id),
  KEY cand_id (cand_id)
);

CREATE TABLE local_polls (
  year smallint(6) NOT NULL,
  poll int(11) NOT NULL,
  vill_id int(11) NOT NULL,
  no tinyint(4) NOT NULL,
  PRIMARY KEY (year,vill_id,no),
  KEY vill_id (vill_id)
);

CREATE TABLE local_voters (
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  voter int(11) NOT NULL,
  PRIMARY KEY (year,vill_id),
  KEY vill_id (vill_id)
);

CREATE TABLE parties (
  id smallint(6) NOT NULL AUTO_INCREMENT,
  name varchar(96) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
);

CREATE TABLE president_candidates (
  year smallint(6) NOT NULL,
  cand_id smallint(6) NOT NULL,
  vice_cand_id smallint(6) NOT NULL,
  no tinyint(4) NOT NULL,
  party_id smallint(6) NOT NULL,
  PRIMARY KEY (year,no),
  UNIQUE KEY year_cand (year,cand_id),
  UNIQUE KEY year_vice (year,vice_cand_id),
  UNIQUE KEY year_party (year,party_id),
  KEY cand_id (cand_id),
  KEY party_id (party_id),
  KEY vice_cand_id (vice_cand_id)
);

CREATE TABLE president_polls (
  no tinyint(4) NOT NULL,
  poll int(11) NOT NULL,
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  PRIMARY KEY (vill_id,year,no),
  KEY vill_id (vill_id)
);

CREATE TABLE president_voters (
  year smallint(6) NOT NULL,
  voter int(11) NOT NULL,
  vill_id int(11) NOT NULL,
  PRIMARY KEY (year,vill_id),
  KEY vill_id (vill_id)
);

CREATE TABLE recalls (
  cand_id smallint(6) NOT NULL,
  year smallint(6) NOT NULL,
  vill_id int(11) NOT NULL,
  consent int(11) NOT NULL,
  against int(11) NOT NULL,
  void int(11) NOT NULL,
  voter int(11) NOT NULL,
  PRIMARY KEY (cand_id,year,vill_id),
  KEY vill_id (vill_id)
  KEY cand_id (cand_id)
);

CREATE TABLE referendums (
  ref_case tinyint(4) NOT NULL,
  vill_id int(11) NOT NULL,
  consent int(11) NOT NULL,
  against int(11) NOT NULL,
  void int(11) NOT NULL,
  voter int(11) NOT NULL,
  PRIMARY KEY (ref_case,vill_id),
  KEY vill_id (vill_id)
);

CREATE TABLE villages (
  id int(11) NOT NULL,
  name varchar(32) NOT NULL,
  dist smallint(6) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name,dist),
  KEY dist (dist)
);

ALTER TABLE districts
  ADD CONSTRAINT districts_ibfk_1 FOREIGN KEY (city) REFERENCES cities (id);

ALTER TABLE legislator_at_large_candidates
  ADD CONSTRAINT legislator_at_large_candidates_ibfk_1 FOREIGN KEY (party_id) REFERENCES parties (id);

ALTER TABLE legislator_at_large_polls
  ADD CONSTRAINT legislator_at_large_polls_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE legislator_polls
  ADD CONSTRAINT legislator_polls_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE legislator_voters
  ADD CONSTRAINT legislator_voters_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE local_candidates
  ADD CONSTRAINT local_candidates_ibfk_1 FOREIGN KEY (city_id) REFERENCES cities (id),
  ADD CONSTRAINT local_candidates_ibfk_2 FOREIGN KEY (cand_id) REFERENCES candidates (id),
  ADD CONSTRAINT local_candidates_ibfk_3 FOREIGN KEY (party_id) REFERENCES parties (id);

ALTER TABLE local_polls
  ADD CONSTRAINT local_polls_ibfk_2 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE local_voters
  ADD CONSTRAINT local_voters_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE president_candidates
  ADD CONSTRAINT president_candidates_ibfk_1 FOREIGN KEY (cand_id) REFERENCES candidates (id),
  ADD CONSTRAINT president_candidates_ibfk_2 FOREIGN KEY (party_id) REFERENCES parties (id),
  ADD CONSTRAINT president_candidates_ibfk_3 FOREIGN KEY (vice_cand_id) REFERENCES candidates (id);

ALTER TABLE president_polls
  ADD CONSTRAINT president_polls_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE president_voters
  ADD CONSTRAINT president_voters_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE recalls
  ADD CONSTRAINT recalls_ibfk_1 FOREIGN KEY (cand_id) REFERENCES candidates (id),
  ADD CONSTRAINT recalls_ibfk_2 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE referendums
  ADD CONSTRAINT referendums_ibfk_1 FOREIGN KEY (vill_id) REFERENCES villages (id);

ALTER TABLE villages
  ADD CONSTRAINT villages_ibfk_1 FOREIGN KEY (dist) REFERENCES districts (id);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
