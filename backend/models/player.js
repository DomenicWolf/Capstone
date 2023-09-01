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

const leagueBaseUrl = 'https://na1.api.riotgames.com/lol/'
const tftBaseUrl = 'https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/'
const headers = {
  "X-Riot-Token": process.env.API_KEY
}
class Player {
   // looks for player with matching summoner id

   static async get(summonerId){
        const result = await  db.query(
            `SELECT
            summoner_id AS "summonerId", summoner_name AS "summonerName", account_id AS "accountId",
            puuid, profile_icon AS "profileIcon", summoner_level AS "summonerLevel", flex_rank AS "flexRank",
            flex_tier AS "flexTier", flex_lp AS "flexLp", flex_wins AS "flexWins", flex_losses AS "flexLosses",
            tft_rank AS "tftRank", tft_tier AS  "tftTier", tft_lp AS "tftLp", tft_wins AS "tftWins", tft_losses AS "tftLosses",
            solo_rank AS "soloRank", solo_tier AS "soloTier", solo_lp AS "soloLp", solo_wins AS "soloWins",
            solo_losses AS "soloLosses" 
              FROM
                players WHERE 
                summoner_id ILIKE $1`,
                [summonerId]
        );
        const player = result.rows[0];
        // console.log(player)
        if (!player) return null;
    const response = {
      summonerId: player.summonerId,
      summonerName: player.summonerName,
      accountId: player.accountId,
      puuid: player.puuid,
      profileIcon: player.profileIcon,
      summonerLevel: player.summonerLevel,
      flex: {
          rank: player.flexRank,
          tier: player.flexTier,
          lp: player.flexLp,
          wins: player.flexWins,
          losses: player.flexLosses,
      },
      tft: {
          rank: player.tftRank,
          tier: player.tftTier,
          lp: player.tftLp,
          wins: player.tftWins,
          losses: player.tftLosses,
      },
      solo: {
          rank: player.soloRank,
          tier: player.soloTier,
          lp: player.soloLp,
          wins: player.soloWins,
          losses: player.soloLosses,
      },
  };

  return response;
        
   }

  static async add(summonerId){
    // let apiV4Result;
    // let apiLeagueResult;
    // let apiTftResult;
    const test =  await Player.get(summonerId)
    console.log(test,111)
    try {    
      const apiV4Result = await axios.get(`${leagueBaseUrl}summoner/v4/summoners/${summonerId}`,{headers});
      // apiLeagueResult = await axios.get(`${leagueBaseUrl}league/v4/entries/by-summoner/${apiV4Result.data.id}`,{headers});
      // apiTftResult = await axios.get(`${tftBaseUrl}${apiV4Result.data.id}`,{headers});
      const [apiLeagueResult, apiTftResult] = await Promise.all([
        axios.get(`${leagueBaseUrl}league/v4/entries/by-summoner/${apiV4Result.data.id}`, { headers }),
        axios.get(`${tftBaseUrl}${apiV4Result.data.id}`, { headers }),
      ]);
    
      
      let tft;
      for(let d of apiTftResult.data){
        if(d.queueType === "RANKED_TFT") tft = d
      }
      let flex;
      let solo;
      for(let stats of apiLeagueResult.data){
        if(stats.queueType === "RANKED_FLEX_SR") flex = stats;
        if(stats.queueType === "RANKED_SOLO_5x5") solo = stats;
      };
      const dbResult = await db.query(
        `INSERT INTO players
          (summoner_id,
           summoner_name,
           account_id,
           puuid,
           profile_icon,
           summoner_level,
           flex_rank,
           flex_tier,
           flex_lp,
           flex_wins,
           flex_losses,
           tft_rank,
           tft_tier,
           tft_lp,
           tft_wins,
           tft_losses,
           solo_rank,
           solo_tier,
           solo_lp,
           solo_wins,
           solo_losses)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
            [apiV4Result.data.id,apiV4Result.data.name,apiV4Result.data.accountId,apiV4Result.data.puuid,
            apiV4Result.data.profileIconId,apiV4Result.data.summonerLevel,flex ? flex.rank : null,
            flex ? flex.tier : null,flex ? flex.leaguePoints : null,flex ? flex.wins : null,flex ? flex.losses : null,
            tft ? tft.rank : null, tft ? tft.tier : null, tft ? tft.leaguePoints : null, tft ? tft.wins : null,
            tft ? tft.losses : null, solo ? solo.rank :  null, solo ? solo.tier : null, solo ? solo.leaguePoints : null,
            solo ? solo.wins : null, solo ? solo.losses : null
          ]
      )   
        
          return Player.get(apiV4Result.data.id) 
          }catch(e){
            console.log(e)
        
        if (e.response && e.response.status === 429) {
          throw new RateLimitError(e)
      }else if(e.response && e.response.status === 404){
        throw new NotFoundError(e)
      }else {
          throw new BadRequestError('DUPLICATE')
      }
    }
  }

}

module.exports = Player;