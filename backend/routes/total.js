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

router.get('/matches/:summonerId', async function(req,res,next) {
    try{
        // let playerInfo = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/${req.params.summonerId}`,{headers});
       let player = await Player.get(req.params.summonerId);
    //    console.log(player)
    //    if(!player) player = await Player.add(req.params.summonerId);
       const matches = await Match.addAllMatches(player.puuid,player.summonerId);
       return res.json({matches})
    }catch(e){
        return next(e)
    }
});

router.get('/champs/:summonerId', async function(req,res,next) {
    try{
       let player = await Player.get(req.params.summonerId);
       let soloChamps = await Champ.getAll(player.summonerId,'solo');
       const flexChamps = await Champ.getAll(player.summonerId,'flex');
       const data = {soloChamps,flexChamps}
        if(soloChamps.length === 0){
            console.log(soloChamps,7777777)
            soloChamps = await Champ.getAll(player.summonerId,'solo');
        }
        return res.json(soloChamps)
    }catch(e){
        return next(e)
    }
});

module.exports = router;