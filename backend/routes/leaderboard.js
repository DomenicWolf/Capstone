"use strict";

/** Routes for stats. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, RateLimitError, NotFoundError } = require("../expressError");
const Match = require('../models/match');
const Player = require('../models/player');
const Champ = require('../models/champ');
const axios = require('axios')
const db = require("../db");


const router = express.Router();

const headers = {
    "X-Riot-Token": process.env.API_KEY
  }

router.get('/lol', async function(req,res,next) {
    let result = await axios.get('https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',{headers})
    result = result.data.entries
    const sorted = result.sort((a,b) => b.leaguePoints - a.leaguePoints);
    const highest = sorted.slice(0,3);
    
    return res.json({highest})
});


module.exports = router;