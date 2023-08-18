"use strict";

/** Routes for stats. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Match = require('../models/match');
const Player = require('../models/player');


const router = express.Router();




router.get('/:summoner', async function(req,res,next) {

})

router.post('/:summoner', async function(req, res, next) {
    try{

        const player = await Player.get(req.params.summoner);
        if(!player) player = await Player.add(req.params.summoner);
        if(!player) throw new BadRequestError('not found');
        const matches = await Match.addAllMatches(player.puuid,player.summonerId);
        console.log(matches)
        return res.json({matches})


    }catch(e){
        return next(e)
    }
})


module.exports = router;