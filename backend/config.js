"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");


const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
const Uri =  (process.env.NODE_ENV === "test")
? `postgresql://dom:${process.env.PG_PASS}@127.0.0.1:5432/true_stat_db`
: process.env.DATABASE_URL || `postgresql://dom:${process.env.PG_PASS}@127.0.0.1:5432/true_stat_db`;

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Stat Website Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, Uri);
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  Uri,
};