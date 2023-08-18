"use strict";


const db = require("../db");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { sqlForPartialUpdate } = require("../helpers/sql");
const fileReader = require('../helpers/fileReader');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const Player = require('./player');
// const leagueBaseUrl = 'https://americas.api.riotgames.com/lol/match/v5/matches/'
// const tftBaseUrl = 'https://americas.api.riotgames.com/tft/match/v1/matches/'
const headers = {
  "X-Riot-Token": process.env.API_KEY
}

class Champ {
    static async getInfo(champId){
        const result = await db.query(
            `SELECT champ_id AS "champId", champ_icon AS "champIcon" FROM champs
                WHERE champ_id = $1`,
                [champId]
        );
        return result.rows[0]
    }
    static async get(summonerId,champId,type){
        const result = await db.query(
            `SELECT summoner_id AS "summonerId",champ_id AS "champId",champ_icon AS "champIcon",
            time_played AS "timePlayed", games_played AS "gamesPlayed",games_won AS "gamesWon",
            games_lost AS "gamesLost", cs,kills,deaths,assists,kda FROM player_champs_${type}
             WHERE summoner_id = $1 AND champ_id = $2`,[summonerId,champId]
        );
        return result.rows[0];
    }

    static async getAll(summonerId,type){
        const result = await db.query(
            `SELECT summoner_id AS "summonerId",champ_id AS "champId",champ_icon AS "champIcon",
            time_played AS "timePlayed", games_played AS "gamesPlayed",games_won AS "gamesWon",
            games_lost AS "gamesLost", cs,kills,deaths,assists,kda FROM player_champs_${type}
             WHERE summoner_id = $1`,[summonerId]
        );
        return result.rows;
    }

    static async addToSolo(summonerId,champId,champName,outcome,timePlayed,cs,kills,deaths,assists){
        let alreadyExists = false;
        let champ;
        try{
            champ = await Champ.get(summonerId,champId,'solo');
        }catch(e){

        }
        let gamesPlayed;
        let newCs;
        let newTimePlayed;
        let kda = (kills+assists)/deaths;
        if(champ){
            alreadyExists = true;
            gamesPlayed = champ.gamesPlayed + 1;
            newCs = cs/(timePlayed/60);
            newTimePlayed = champ.timePlayed + timePlayed;
            kills = champ.kills + kills;
            deaths = champ.deaths + deaths;
            assists = champ.assists + assists;
            kda = (kills + assists) / deaths
        }
        
        let type;
        let amount;
        let data;
        
        if(outcome === 'win' && alreadyExists){
            type = 'won';
            let gamesWon = champ.gamesWon + 1;
            cs = newCs; 
            timePlayed = newTimePlayed;
            data = {cs,gamesPlayed,gamesWon,timePlayed,kills,deaths,assists,kda};
        }else if(outcome === 'loss' && alreadyExists){
            type = 'lost';
            let gamesLost = champ.gamesLost + 1;
            cs = newCs
            timePlayed = newTimePlayed;
            data = {cs,gamesPlayed,gamesLost,timePlayed,kills,deaths,assists,kda};
        }
        let result;
        if(alreadyExists){
            
            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                  summonerId: "summoner_id",
                  champId: "champ_id",
                  champName: "champ_id",
                  gamesPlayed: "games_played",
                  gamesWon: "games_won",
                  gamesLost:"games_lost",
                  timePlayed:"time_played"
                });
            const summonerVarIdx = "$" + (values.length + 1);
        
            const querySql = `UPDATE player_champs_solo 
                              SET ${setCols} 
                              WHERE summoner_id = ${summonerVarIdx} 
                              AND champ_id = ${champId}
                              RETURNING * `;
            result = await db.query(querySql, [...values, summonerId]);
            const addedChamp = result.rows[0];
            return addedChamp;
            
        }else {
            let champIcon = await Champ.getInfo(champId);
            champIcon = champIcon.champIcon;
           
            let gamesWon = 0;
            let gamesLost = 0;
            if(outcome === 'win') gamesWon++;
            if(outcome === 'loss') gamesLost++;
            cs = cs/(timePlayed/60);
            cs = cs.toFixed(1)
            result = await db.query(
                `INSERT INTO player_champs_solo
                 (summoner_id, champ_id,champ_name,time_played,games_played,games_won,games_lost,cs,kills,deaths,assists,kda,champ_icon)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                 RETURNING *`,
                 [summonerId,champId,champName,timePlayed,1,gamesWon,gamesLost,cs,kills,deaths,assists,kda,champIcon]
            )

            const addedChamp = result.rows[0];
            return addedChamp;
        }
    }
    

    static async addToFlex(summonerId,champId,champName,outcome,timePlayed,cs,kills,deaths,assists){
        let alreadyExists = false;
        let champ;
        try{
            champ = await Champ.get(summonerId,champId,'flex');
        }catch(e){

        }
        let gamesPlayed;
        let newCs;
        let newTimePlayed;
        let kda = (kills+assists)/deaths;
        if(champ){
            alreadyExists = true;
            gamesPlayed = champ.gamesPlayed + 1;
            newCs = cs/(timePlayed/60);
            newTimePlayed = champ.timePlayed + timePlayed;
            kills = champ.kills + kills;
            deaths = champ.deaths + deaths;
            assists = champ.assists + assists;
            kda = (kills+assists)/deaths;
        }
        
        let type;
        let amount;
        let data;
        if(outcome === 'win' && alreadyExists){
            type = 'won';
            let gamesWon = champ.gamesWon + 1;
            cs = newCs; 
            timePlayed = newTimePlayed;
            data = {cs,gamesPlayed,gamesWon,timePlayed,kills,deaths,assists,kda};
        }else if(outcome === 'loss' && alreadyExists){
            type = 'lost';
            let gamesLost = champ.gamesLost + 1;
            cs = newCs
            timePlayed = newTimePlayed;
            data = {cs,gamesPlayed,gamesLost,timePlayed,kills,deaths,assists,kda};
        }
        let result;
        if(alreadyExists){
            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                  summonerId: "summoner_id",
                  champId: "champ_id",
                  champName: "champ_id",
                  gamesPlayed: "games_played",
                  gamesWon: "games_won",
                  gamesLost:"games_lost",
                  timePlayed:"time_played"
                });
            const summonerVarIdx = "$" + (values.length + 1);
        
            const querySql = `UPDATE player_champs_flex 
                              SET ${setCols} 
                              WHERE summoner_id = ${summonerVarIdx} 
                              AND champ_id = ${champId}
                              RETURNING * `;
            result = await db.query(querySql, [...values, summonerId]);
            const addedChamp = result.rows[0];
            return addedChamp;
            
        }else {
            let champIcon = await Champ.getInfo(champId);
            
            champIcon = champIcon.champIcon;
            let gamesWon = 0;
            let gamesLost = 0;
            if(outcome === 'win') gamesWon++;
            if(outcome === 'loss') gamesLost++;
            cs = cs/(timePlayed/60);
            cs = cs.toFixed(1)
            result = await db.query(
                `INSERT INTO player_champs_flex
                 (summoner_id, champ_id,champ_name,time_played,games_played,games_won,games_lost,cs,kills,deaths,assists,kda,champ_icon)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                 RETURNING *`,
                 [summonerId,champId,champName,timePlayed,1,gamesWon,gamesLost,cs,kills,deaths,assists,kda,champIcon]
            )
            const addedChamp = result.rows[0];
            return addedChamp;
        }
    }

    static async addToTotal(summonerId,champId,champName,outcome,timePlayed,cs,kills,deaths,assists){
        let alreadyExists = false;
        let champ;
        try{
            champ = await Champ.get(summonerId,champId,'total');
        }catch(e){

        }
        let gamesPlayed;
        let newCs;
        let newTimePlayed;
        let kda = (kills+assists)/deaths;
        if(champ){
            alreadyExists = true;
            gamesPlayed = champ.gamesPlayed + 1;
            newCs = cs/(timePlayed/60);
            newTimePlayed = champ.timePlayed + timePlayed;
            kills = champ.kills + kills;
            deaths = champ.deaths + deaths;
            assists = champ.assists + assists;
            kda = (kills+assists)/deaths;
        }
        
        let type;
        let amount;
        let data;
        if(outcome === 'win' && alreadyExists){
            type = 'won';
            let gamesWon = champ.gamesWon + 1;
            cs = newCs; 
            timePlayed = newTimePlayed;
            data = {cs,gamesPlayed,gamesWon,timePlayed,kills,deaths,assists,kda};
        }else if(outcome === 'loss' && alreadyExists){
            type = 'lost';
            let gamesLost = champ.gamesLost + 1;
            cs = newCs
            timePlayed = newTimePlayed;
            data = {cs,gamesPlayed,gamesLost,timePlayed,kills,deaths,assists,kda};
        }
        let result;
        if(alreadyExists){
            
            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                  summonerId: "summoner_id",
                  champId: "champ_id",
                  champName: "champ_id",
                  gamesPlayed: "games_played",
                  gamesWon: "games_won",
                  gamesLost:"games_lost",
                  timePlayed:"time_played"
                });
            const summonerVarIdx = "$" + (values.length + 1);
        
            const querySql = `UPDATE player_champs_total
                              SET ${setCols} 
                              WHERE summoner_id = ${summonerVarIdx} 
                              AND champ_id = ${champId}
                              RETURNING * `;
            result = await db.query(querySql, [...values, summonerId]);
            const addedChamp = result.rows[0];
            return addedChamp;
            
        }else {
           
            let champIcon = await Champ.getInfo(champId);
            
            champIcon = champIcon.champIcon;
            let gamesWon = 0;
            let gamesLost = 0;
            if(outcome === 'win') gamesWon++;
            if(outcome === 'loss') gamesLost++;
            cs = cs/(timePlayed/60);
            cs = cs.toFixed(1)
            result = await db.query(
                `INSERT INTO player_champs_total
                 (summoner_id, champ_id,champ_name,time_played,games_played,games_won,games_lost,cs,kills,deaths,assists,kda,champ_icon)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                 RETURNING *`,
                 [summonerId,champId,champName,timePlayed,1,gamesWon,gamesLost,cs,kills,deaths,assists,kda,champIcon]
            )

            const addedChamp = result.rows[0];
            return addedChamp;
        }
    }

}

module.exports = Champ;