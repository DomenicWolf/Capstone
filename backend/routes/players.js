"use strict";

/** Routes for stats. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Player = require('../models/player');
const axios = require('axios')


const router = express.Router();
const headers = {
  "X-Riot-Token": process.env.API_KEY
}

router.get("/:summoner", async function (req, res, next) {
    try {
      let playerInfo = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summoner}`,{headers})
      const player = await Player.get(playerInfo.data.id);
      return res.json({player});
    }catch(e){
      return next(e)
    }
  });

  router.post("/:summoner",async function (req,res,next) {
    try {
      let playerInfo = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summoner}`,{headers})
      const player = await Player.add(playerInfo.data.id);
      return res.json({player})
    }catch(e){
      return next(e)
    }
  });

  module.exports = router;