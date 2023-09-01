"use strict";


const db = require("../db");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  RateLimitError
} = require("../expressError");

const Champ = require('./champ');

const headers = {
  "X-Riot-Token": process.env.API_KEY
}

class Match {
//get one singular match from either addToSolo,flex or total for a given player
    static async getOne(matchId,type,summoner_id){
        const result = await db.query(
            ` SELECT * FROM player_${type}_matches
                WHERE matchId = $1 AND summoner_id = $2`,[matchId,summoner_id]
        );
        
        const match = result.rows[0];
        if (!match) throw new NotFoundError(`No match: ${matchId}`);

        return match;
    }
// get all matches from either solo,flex or total for a given player
    static async getAll(matchId,type,summoner_id){
        const result = await db.query(
            `SELECT * FROM player_${type}_matches
                WHERE matchId = $1 AND summoner_id = $2`, [matchId,summoner_id]
        );

        const match = result.rows[0];
        if(!match) throw new NotFoundError(`No match: ${matchId}`);
        return match;
    }

//add all matches for a given player, will seperate solo and flex itself
    static async addAllMatches(puuid,summonerId){
        const lolBaseUrl = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/';
        const endUrl = '/ids?start=0&count=16&queue=420'
        let apiResult;
        // get info from riot api, return list of matchId, can be used to look up details of each game from seperate api, only get 16 for now since rate limited
        try{
            apiResult = await axios.get(`${lolBaseUrl}${puuid}${endUrl}`,{headers});
        }catch(e){
            console.log(e.response.status)
            if (e.response && e.response.status === 429) {
                throw new RateLimitError(e)
            }else {
                throw new BadRequestError(e)
            }
        }
        
        const promises = apiResult.data.map(async (result) => {
            const test = await db.query(`SELECT 'player_solo_matches' AS source_table, 
                match_id AS "matchId",summoner_id AS "summonerId", match_details AS "matchDetails"
            FROM player_solo_matches
            WHERE match_id = '${result}' AND summoner_id = '${summonerId}'
            UNION
            SELECT 'player_flex_matches' AS source_table, 
            match_id AS "matchId",summoner_id AS "summonerId", match_details AS "matchDetails"
            FROM player_flex_matches
            WHERE match_id = '${result}' AND summoner_id = '${summonerId}'
            UNION
            SELECT 'player_total_matches' AS source_table, 
            match_id AS "matchId",summoner_id AS "summonerId", match_details AS "matchDetails"
            FROM player_total_matches
            WHERE summoner_id = '${summonerId}' AND
            match_id = '${result}'`);
            if(test.rows.length !== 0){
                return test.rows[0];
            } 
            else{
                const r = await Match.addLol(result, summonerId);
                return r;
            }
        });
        
        const filteredResults = await Promise.all(promises);

        const validResults = filteredResults.filter((result) => result !== null);

        return validResults;

    }

//add summoner rift matches and add stats from each match to champion table
    static async addLol(matchId,summonerId,playerInfoo){
        //get summoner info  from riot api
        const baseUrl = "https://americas.api.riotgames.com/lol/match/v5/matches/";
        let apiResult;
        let player;
        try{
            apiResult = await axios.get(`${baseUrl}${matchId}`,{headers});
            player = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}`,{headers});
        }catch(e){
            console.log(e.response.status)
            if (e.response && e.response.status === 429) {
                throw new RateLimitError(e)
            }else {
                throw new BadRequestError(e)
            }
        }
        //check to make sure game was started during current ranked season
        if(apiResult.data.info.gameCreation < process.env.SPLIT_TIME){
            return null;
        }
        
        apiResult = apiResult.data;
        let type;
        //get info for correct user from the match participants
        let playerInfo = apiResult.info.participants.filter(p => p.puuid === player.data.puuid);
        playerInfo = playerInfo[0]
        let outcome = playerInfo.win === true ? 'win' : 'loss';
        //check for duplicate matchId, if so return said match details
        const testForDup = await db.query(
            `SELECT * FROM player_total_matches
                WHERE match_id = $1 AND summoner_id = 
                $2`,[matchId,summonerId]
        );
        if(testForDup.rows.length !== 0){
            const test = testForDup.rows[0];
            const matchDate = test.matchDate;
            const matchDetails = apiResult.info
            const data = {matchId,summonerId,matchDate,matchDetails};
            return data;
        }
        // add info from match to champ db for the current player
        const cs = playerInfo.totalMinionsKilled + playerInfo.totalAllyJungleMinionsKilled + playerInfo.totalEnemyJungleMinionsKilled
        await Champ.addToTotal(summonerId,playerInfo.championId,playerInfo.championName,outcome,playerInfo.timePlayed,
            cs,playerInfo.kills,playerInfo.deaths,playerInfo.assists)
        // if(apiResult.info.queueId === 440){
        //     type = 'flex';
        //     await Champ.addToFlex(summonerId,playerInfo.championId,playerInfo.championName,outcome,playerInfo.timePlayed,
        //         cs,playerInfo.kills,playerInfo.deaths,playerInfo.assists)
        // }
         if(apiResult.info.queueId === 420){
            type = 'solo';
            const testForChamp = await Champ.get(summonerId,playerInfo.championId,'solo')
            let alreadyExists = testForChamp ? true : false; 
            await Champ.addToSolo(summonerId,playerInfo.championId,playerInfo.championName,outcome,playerInfo.timePlayed,
                cs,playerInfo.kills,playerInfo.deaths,playerInfo.assists,alreadyExists)
        } 
        //get sought after info from the match details, lot of unwanted info given by riot api
        let meta = apiResult.info
        let selectedInfo = [{queueId:meta.queueId,
                             platformId:meta.platformId,
                             teams:[
                                {win:meta.teams[0].win,
                                teamId:meta.teams[0].teamId,
                                objectives:meta.teams[0].objectives},
                                {win:meta.teams[1].win,
                                teamId:meta.teams[1].teamId,
                                objectives:meta.teams[1].objectives}
                             ],
                            gameCreation:apiResult.info.gameCreation}];
        let participants = []
        apiResult.info.participants.forEach(obj => {
            let selectedData = {
                puuid: obj.puuid,
                kills: obj.kills,
                deaths: obj.deaths,
                champlevel: obj.champlevel,
                championId: obj.championId,
                championName:obj.championName,
                assists:obj.assists,
                totalMinionsKilled:obj.totalMinionsKilled,
                totalAllyJungleMinionsKilled:obj.totalAllyJungleMinionsKilled,
                totalEnemyJungleMinionsKilled:obj.totalEnemyJungleMinionsKilled,
                lane:obj.lane,
                pentaKills:obj.pentaKills,
                role:obj.role,
                summonerName:obj.summonerName,
                teamPosition:obj.teamPosition,
                timePlayed:obj.timePlayed,
                win:obj.win,
                visionScore:obj.visionScore,
                goldSpent:obj.goldSpent,
                item0:obj.item0,
                item1:obj.item1,
                item2:obj.item2,
                item3:obj.item3,
                item4:obj.item4,
                item5:obj.item5,
                item6:obj.item6,
                totalDamageDealtToChampions:obj.totalDamageDealtToChampions,
                totalDamageTaken:obj.totalDamageTaken,
                gameCreation:obj.gameCreation,
                gameId:obj.gameId,
                wardsPlaced:obj.wardsPlaced,
                rune1:obj.perks.styles[0].style,
                rune2:obj.perks.styles[1].style,
                summoner1Id:obj.summoner1Id,
                summoner2Id:obj.summoner2Id,
                sightWardsBoughtInGame:obj.sightWardsBoughtInGame,
                teamId:obj.teamId
            };
            participants.push(selectedData);
        });
        participants = {participants}
        selectedInfo.push(participants)
        selectedInfo = JSON.stringify(selectedInfo);
        const result = await db.query(
            `INSERT INTO player_${type}_matches
                (match_id,summoner_id,match_date,match_details) 
                VALUES
                ($1,$2,$3,$4)
                RETURNING
                match_id AS "matchId", summoner_id AS "summonerId", match_date AS "matchDate", match_details AS "matchDetails"`,
                [apiResult.metadata.matchId,summonerId,null,selectedInfo]
        );
        const total = await db.query(
            `INSERT INTO player_total_matches
                (match_id,summoner_id,match_date,match_details) 
                VALUES
                ($1,$2,$3,$4)
                RETURNING
                match_id AS "matchId", summoner_id AS "summonerId", match_date AS "matchDate", match_details AS "matchDetails"`,
                [apiResult.metadata.matchId,summonerId,null,selectedInfo]
        );
        
        return result.rows[0];
    }

//adds all tft ranked matches
    static async addAllTftMatches(puuid,summonerId){
        const tftBaseUrl = 'https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/';
        const endUrl = '/ids?start=0&count=20';
        let apiResult;
        try{
            apiResult = await axios.get(`${tftBaseUrl}${puuid}${endUrl}`,{headers});
        }catch(e){
            if (e.response && e.response.status === 429) {
                throw new RateLimitError(e)
            }else {
                throw new BadRequestError(e)
            }
        }
        let results = [];
        for(let result of apiResult.data){
            const r = await Match.addTft(result,summonerId)
            results.push(r)
        }
        return results;
    }

//adds an individual tft match
    static async addTft(matchId,summonerId){

        const tftBaseUrl = 'https://americas.api.riotgames.com/tft/match/v1/matches/'
        let apiResult;
        try{
            apiResult = await axios.get(`${tftBaseUrl}${matchId}`,{headers})
        }catch(e){
            if (e.response && e.response.status === 429) {
                throw new RateLimitError(e)
            }else {
                throw new BadRequestError(e)
            }
        }
        apiResult = apiResult.data
        const result = await db.query(
            `INSERT INTO player_tft_matches
                (match_id,summoner_id,match_date,match_details) 
                VALUES
                ($1,$2,$3,$4)
                RETURNING
                match_id AS "matchId", summoner_id AS "summonerId", match_date AS "matchDate", match_details AS "matchDetails"`,
                [apiResult.metadata.match_id,summonerId,null,apiResult.info]
        );
        return result.rows[0];
    }
//deletes match details
    static async deleteDetails(matchId,summoner_id,type){
       const result = db.query(
        `UPDATE player_${type}_matches
        SET match_details = null 
        WHERE summoner_id = $1
        AND match_id = $2
        RETURNING *`,
        [summoner_id,matchId]
       );
       return result.rows[0];
    }
}

module.exports = Match;