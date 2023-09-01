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

router.get("/:summonerId", async function (req, res, next) {
    try {
      const player = await Player.get(req.params.summonerId);
      return res.json({player});
    }catch(e){
      return next(e)
    }
  });

  router.post("/:summonerId",async function (req,res,next) {
    try {
      const playerTest = await Player.get(req.params.summonerId)
      if(playerTest !== null){
        console.log(playerTest ,999)
        return playerTest
      }
      console.log(playerTest)
      const player = await Player.add(req.params.summonerId);
      return res.json({player})
    }catch(e){
      return next(e)
    }
  });

  router.get('/test/:name', async function (req,res,next){
    try {
      let player = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.name}`,{headers});
    player = player.data
    return res.send(player)
    }catch(e){
      console.log(e.response)
      if(e.response.status === 404) return res.send('Player not found')
    }
    
  })

  module.exports = router;