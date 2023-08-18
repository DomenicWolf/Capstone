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


const router = express.Router();

const headers = {
    "X-Riot-Token": process.env.API_KEY
}

router.post('/matches/:summoner', async function(req,res,next) {
    let player;
    try{
       let playerInfo = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summoner}`,{headers})
       player = await Player.get(playerInfo.data.id);
       console.log(player)
       if(!player) player = await Player.add(playerInfo.data.id);
       const matches = await Match.addAllMatches(player.puuid,player.summonerId);
       return res.json({matches})
    }catch(e){
        //console.log(e)
        //console.log(e.status)
        return next(e)
    }
});

router.post('/champs/:summoner', async function(req,res,next) {
    let player;
    try{
       let playerInfo = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.summoner}`,{headers})
       player = await Player.get(playerInfo.data.id);
       if(!player) player = await Player.add(playerInfo.data.id);
       const soloChamps = await Champ.getAll(player.summonerId,'solo');
       const flexChamps = await Champ.getAll(player.summonerId,'flex');
       const data = {soloChamps,flexChamps}
        return res.json({data})
    }catch(e){
        console.log(e)
        console.log(e.status)
        return next(e)
    }
});

module.exports = router;