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

router.get('/spells/:spellId', async function (req,res,next){
    const spell = await db.query(
        `SELECT * FROM sum_spells
            WHERE sum_id ILIKE $1`,
            [req.params.spellId]
    );
    return res.json(spell.rows[0])
});

router.get('/profile/:profileId', async function (req,res,next){
    const profile = await db.query(
        `SELECT * FROM profile_icons
            WHERE profile_id = $1`,
            [req.params.profileId]
    );
        
    return res.json(profile.rows[0])
});


router.get('/items/:itemId', async function (req,res,next){
    const item = await db.query(
        `SELECT * FROM items
            WHERE item_id = $1`,
            [req.params.itemId]
    );
        
    return res.json(item.rows[0])
});


router.get('/ranks/:rankName', async function (req,res,next){
    const rank = await db.query(
        `SELECT * FROM rank_icons
            WHERE rank_name ILIKE $1`,
            [req.params.rankName]
    );
        
    return res.json(rank.rows[0])
});


module.exports = router;