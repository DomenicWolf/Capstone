"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { Uri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: Uri,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    connectionString: Uri
  });
}

db.connect();

module.exports = db;