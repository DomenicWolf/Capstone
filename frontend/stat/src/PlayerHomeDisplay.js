import './PlayerHomeDisplay.css'
import challenger from './challenger.png'
import StatApi from './api'
import { useState,useEffect,useCallback } from 'react'

const PlayerHomeDisplay = ({player}) => {
    const iconUrl = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/'
    const [playerInfo, setPlayerInfo] = useState([]);

    const id = player.summonerId

    async function getPlayerInfo() {
        
        try {
            
            
            const data = await StatApi.getLolPlayerInfo(id);
            setPlayerInfo(data.data);
           
        } catch (error) {
            console.error("Error playerinfo:", error);
        }
    }

   useEffect(() => {
        console.log('test again')
        getPlayerInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[] );
    let profileIcon;
    if(playerInfo) 
    if(playerInfo.length !== 0) profileIcon = playerInfo.player.profileIcon
    return (
        <div className="container player-leaderboard me-3">
            
            {/* <div className='challenger'>
                <img className='' src={challenger}></img>
            </div> */}
            <div className='player-leader-main'>

            
            <p className='lol-home-name'><img className='icon-leader'src={`${iconUrl}${profileIcon}.png`} height={90} width={90}/> {player.summonerName}</p>
            <p className='lol-home-lp'>{player.leaguePoints} LP</p>
            <div className='d-flex justify-content-around'>
                <p className='test'>Wins:</p>
                <p className='test'>Losses:</p>
            </div>
            </div>
            <div className='player-leader-second'>

            
            <div className='d-flex justify-content-around'>
                <p className='test'>{player.wins}</p>
                <p className='test'>{player.losses}</p>
            </div>
            </div>
        </div>
    )
}

export default PlayerHomeDisplay;