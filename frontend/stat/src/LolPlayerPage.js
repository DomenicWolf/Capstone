import { useState,useEffect } from 'react'
import StatApi from './api'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import './LolPlayerPage.css'
import ChampDisplay from './ChampDisplay'
import LolMatchesbar from './LolMatchesBar'
import LolChampDisplaySide from './LolChampDisplaySide'

const LolPlayerPage = () => {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [player,setPlayer] = useState(null)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const playerName = queryParams.get('name');
    let topThree;
    let champs;
   console.log(player ===429,3453454)
   console.log(player)
  
    
    useEffect(() => {
        async function getPlayerInfo(name) {
            const playerInfo = await StatApi.getLolPlayerData(name);
            setPlayer(playerInfo)
        }
        
        getPlayerInfo(playerName);
        
    },[playerName])
    if(player && player !== 404 && player !== 429 ){
            
            champs = player[4]
            const sorted = champs.sort((a,b) =>  (  Number(b.wr)-Number(a.wr)   )  ) ;
            topThree = sorted.slice(0,3)
            console.log('test')
        }
  


   

    let wr = player && player !== 404 && player !== 429 ? (player[3].player.solo.wins/(player[3].player.solo.wins + player[3].player.solo.losses)*100).toFixed(1) : '';
    let wrColor;
    
    if(wr >= 75) wrColor = 'green';
    else if(wr >= 50) wrColor = 'yellow-green';
    else if(wr > 25) wrColor ='orange';
    else wrColor = 'red'
    
   
    return (
        <div className='container-fluid container-sm'>
            {player && player !== 404  && player !== 429? 
            <div>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='container-fluid text-center player-main'>
                            <div className='container  player-info pb-4'>
                                <div>
                                    <h2 className='player-page-text'>
                                        <img className='profile-icon' src={player[0].profile_icon} height={100}></img> {player[3].player.summonerName}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className='container player-info player-main text-center mt-2 pt-2 pb-2'>
                            
                            <div className='player-rank-container'>
                                <img src={player[1].rank_icon} className='player-rank-img'></img>
                            </div>
                            <p className='lol-player-rank'>{player[1].rank_name? capitalizeFirstLetter(player[1].rank_name) : 'unranked'} {player[3].player.solo.rank}</p>
                            <p className='player-page-text'>{player[3].player.solo.lp} LP</p>
                            <div className='container d-flex justify-content-around'>

                            </div>
                            <div className='container d-flex justify-content-around rank-bottom mb-1'>
                                <p className={`${wrColor} lol-player-wr`}>{wr !== 'NaN' ? `${wr}%` : ''} ({player[3].player.solo.wins}W {player[3].player.solo.losses}L)</p>
                            </div>
                            <button className='btn btn-update'>Update</button>
                        </div>

                        <div className='container mt-2'>
                                {champs.map((c) => (
                                    <LolChampDisplaySide champ={c}/>
                                ))}
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <div className='container-fluid text-center player-main'>
                            <div className='container  champ-info d-flex'>
                                {topThree.map((c) => <ChampDisplay champ={c}/>) }
                            
                            </div>
                           
                        </div>
                            <div className='container text-center  mt-2'>
                                {player[2].matches.map((m) => <LolMatchesbar match={m} puuid={player[3].player.puuid}/>)}
                            </div>
                    </div>
                </div>
            </div>
            : 
            ''
            }
            {player === 404 ? 
                <div className='container text-center'>
                    <h1>PLAYER NOT FOUND!</h1>
                </div>
                 :
                ''
                  }
             {player === 429 ? 
                <div className='container text-center'>
                    <h1>Too many requests, please wait and then try again.</h1>
                </div>
                 :
                ''
                  }
                {!player  ?                     
                    <div className='container container-sm text-center mt-5'>
                        <div className=''>
                            <img className='profile-lol-loading-img'src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazg1bmU3NDg4Y2Rza2c0a2tyZnNjZ3EwNzk0MXFtZTB2MTU2Y3VyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIP73vEZmJjFNXtC/giphy.gif' height={200}></img>
                        </div>
                    </div> 
                    : 
                    ''
                    }
        </div>
    )
}

export default LolPlayerPage;