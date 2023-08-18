"use strict";

/** Routes for stats. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Match = require('../models/match');
const Player = require('../models/player');
const Champ = require('../models/champ');


const router = express.Router();


router.post('/:summoner', async function(req,res,next) {
    const player = await Player.get(req.params.summoner);
    const champ = await Champ.addToSolo(player.summonerId,266,'aatrox','loss',600,10);
    return res.json({champ});
});

module.exports = router;