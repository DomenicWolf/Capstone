import axios from "axios";

const BASE_URL = "https://truestat.onrender.com" ;
const API_KEY = process.env.REACT_APP_API_KEY
 

class StatApi {
    static async getLolPlayerData(playerName){
        
        try  {
            const player = await axios.get(`${BASE_URL}/players/test/${playerName}`)
            console.log(player)
            if(player.data === 'Player not found'){
                console.log('ERROR')
                return 404
            } 
            let playerInfo = await axios.get(`${BASE_URL}/players/${player.data.id}`)
            if(!playerInfo.data.player) playerInfo = await axios.post(`${BASE_URL}/players/${player.data.id}`)
            const profileIconUrl = `${BASE_URL}/icons/profile/${playerInfo.data.player.profileIcon}`
            const rankIconUrl = `${BASE_URL}/icons/ranks/${playerInfo.data.player.solo.tier}`
            const matchesUrl = `${BASE_URL}/total/matches/${player.data.id}`;
            const champsUrl = `${BASE_URL}/total/champs/${player.data.id}`;

            const profileIcon =  axios.get(profileIconUrl);
            const rankIcon =  axios.get(rankIconUrl);
            const matches =  axios.get(matchesUrl);
            
            async function fetchData() {
                try {
                    const responses = await Promise.all([profileIcon, rankIcon, matches]);
                    const data = responses.map(response => response.data);
                    const result = [];
                    data.forEach(d => {
                        result.push(d);
                    });
                    result.push(playerInfo.data)
                    return result;
                } catch (error) {
                    console.error('Error:', error);
                    throw error;
                }
            }
            
            const result = await fetchData()
            const champs = await axios.get(champsUrl)
            result.push(champs.data)
            console.log(player.data.id,888)
            return result
        }catch(e){
            console.debug(e)
        }
        
    }


    static async getLolHomePlayer() {
        try{
            const result = await axios.get(`${BASE_URL}/leaderboard/lol`)
            return result;
        }catch(e){

        }
    }

    static async getLolPlayerInfo(summonerId){
       
        let player = await axios.get(`${BASE_URL}/players/${summonerId}`)
        console.log(player)
        console.log(!player.data.player)
        if(!player.data.player){
           player = await axios.post(`${BASE_URL}/players/${summonerId}`)  
        } 
        return player
    }
}

export default StatApi;