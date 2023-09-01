import './LolMatchesBar.css';
import r8000 from  './Styles/8000.png';
import rune8100  from './Styles/8100.png';
import rune8200 from './Styles/8200.png';
import rune8300 from './Styles/8300.png';
import rune8400 from './Styles/8400.png';
import { useState } from 'react';
import ExpandLolMatch from './ExpandLolMatch';

const LolMatchesbar = ({match,puuid}) => {
    console.log(match)
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    const toggleAdditionalInfo = () => {
        setShowAdditionalInfo(prevState => !prevState);
    };
    const player = match.matchDetails[1].participants.filter((m) => m.puuid === puuid)[0]
    const dateFromTimestamp = new Date(match.matchDetails[0].gameCreation);
    const currentDate = new Date();
    const timeDifferenceInMilliseconds = currentDate - dateFromTimestamp;
    const secondsDifference = Math.floor(timeDifferenceInMilliseconds / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    let type;
    if(daysDifference > 1) type = `${daysDifference} days`;
    else if(daysDifference === 1) type = `${daysDifference} day`;
    else if(hoursDifference > 1) type = `${hoursDifference} hours`;
    else if(hoursDifference === 1) type = `${hoursDifference} hour`;
    else type = `${minutesDifference} minutes`;
    const time = (player.timePlayed/60).toFixed(2);
    const minutes = time.slice(0,2);
    const seconds = time.slice(0,2)
    const runes = {'8000':r8000,'8100':rune8100,'8200':rune8200,'8300':rune8300,'8400':rune8400}
    const rune1 = player.rune1.toString()
    const rune2 = player.rune2.toString()
    console.log(player,999)
    const test = [...match.matchDetails[1].participants]
    const team1 = test.splice(0,5)
    const team2 = test.splice(0,5)
    const items = [player.item0,player.item1,player.item2,player.item3,player.item5,player.item6]
    const cs = player.totalAllyJungleMinionsKilled + player.totalEnemyJungleMinionsKilled + player.totalMinionsKilled
    let csColor;
    if((cs/minutes).toFixed(1) >= 9) csColor = 'green';
    else if((cs/minutes).toFixed(1) >= 7) csColor = 'yellow-green';
    else if((cs/minutes).toFixed(1) >= 5) csColor ='orange';
    else csColor = 'red'
    let kdaColor;
    if((player.kills+player.assists)/player.deaths >= 4) kdaColor = 'green';
    else if((player.kills+player.assists)/player.deaths >= 3) kdaColor = 'yellow-green';
    else if((player.kills+player.assists)/player.deaths >= 2) kdaColor ='orange';
    else kdaColor = 'red'
    const obj =  {
        '1': 'SummonerBoost',
        '3': 'SummonerExhaust',
        '4': 'SummonerFlash',
        '6': 'SummonerHaste',
        '7': 'SummonerHeal',
        '11': 'SummonerSmite',
        '12': 'SummonerTeleport',
        '13': 'SummonerMana',
        '14': 'SummonerDot',
        '21': 'SummonerBarrier',
        '30': 'SummonerPoroRecall',
        '31': 'SummonerPoroThrow',
        '32': 'SummonerSnowball',
        '39': 'SummonerSnowURFSnowball_Mark',
        '54': 'Summoner_UltBookPlaceholder',
        '55': 'Summoner_UltBookSmitePlaceholder',
        '2201': 'SummonerCherryHold',
        '2202': 'SummonerCherryFlash'
      }
      const sum1 = obj[(player.summoner1Id).toString()]
      const sum2 = obj[(player.summoner2Id).toString()]
      const sumSpellUrl = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/img/spell/'
      const totalKills = match.matchDetails[1].participants.reduce((acc,curr) => (
        acc + curr.kills
      ),0);
    return (
        <div className='container-fluid match-box row'>
            <div className='container text-center match-info col-lg-2'>
                <h5 className='player-page-type mt-2'>  Ranked solo/duo</h5>
                <div className='decorative-lol-match-1'></div>
                <h5 className='player-page-text mt-1'>{type} ago</h5>
                <h4 className={player.win ? 'green' : 'red'}>{player.win ? 'Victory' : 'Defeat'}</h4>
                <h5 className='player-page-text mt-5'>{minutes}m {seconds}s</h5>
            </div>
            <div className='container text-start match-info-main col-lg-5'>


            <div className='container row'>

                

                
                    

                <div className='match-box-img-container col-lg-3 ml-1'>
                    <img className='match-box-champ-img ' src={`https://ddragon.leagueoflegends.com/cdn/13.15.1/img/champion/${player.championName === 'FiddleSticks' ? 'Fiddlesticks' : player.championName}.png`}></img>
                
                
                <div className="container match-img-container sum-container">
                    <div className="row ">
                        <div className="col-md-1">
                            <img className="sum-img" src={`${sumSpellUrl}${sum1}.png`} alt="Summoner Spell 1" />
                        </div>
                        <div className="col-md-2">
                            <img className="sum-img" src={`${sumSpellUrl}${sum2}.png`} alt="Summoner Spell 2" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1">
                            <img className="rune-img" src={runes[rune1]} alt="Rune 1" />
                        </div>
                        <div className="col-md-1">
                            <img className="rune-img" src={runes[rune2]} alt="Rune 2" />
                        </div>
                    </div>
                </div>
                
                </div>
                <div className='col-lg-4 d-flex flex-column justify-content-around text-center'>
                    <div className='match-kda container '>
                        <p className='match-kda '>{player.kills}/{player.deaths}/{player.assists}</p>
                        <p className={`match-kda-calc ${kdaColor}`}>  {((player.kills+player.assists)/(player.deaths === 0 ? 1 : player.deaths)).toFixed(1)}KDA</p>
                    </div>
                    <div className='container'>
                         <p className={`match-cs ${csColor}`}>{cs}({(cs/minutes).toFixed(1)}) CS</p>
                    </div>
                    <div className='container mt-1'>
                        <p className='vision-score'>{`Vision: ${player.visionScore}`} </p>
                    </div>
                    
                </div>

                <div className='col-md-1'>
                    
                    <div className='decorative-lol-match-2'>
                        
                    </div>
                </div>

                <div className='col-lg-4'>
                    <div className='container text-center'>
                        <p className='lol-damage  mb-1'>Damage</p>
                        <p className='lol-damage given mb-1'>Dealt: {player.totalDamageDealtToChampions}</p>
                       <p className=' lol-damage taken'>Recieved: {player.totalDamageTaken}</p>
                    </div>
                    
                </div>
                </div>
                
                    
                    
                   <div className=' mt-3 ml-2 item-container'>
                        {items.map((i) => (
                            
                             i !== 0 ? <img className='player-match-item me-1 mb-0' src={`https://ddragon.leagueoflegends.com/cdn/13.15.1/img/item/${i}.png`}></img> : <div className='empty me-1 mt-0'></div>
                        ))}
                   </div>   
                
            </div>
            <div className='container text-center match-info col-lg-5  d-flex flex-row mt-4'>
                <div className='container d-flex flex-column first-col '>
                    {team1.map((p) => (
                        <div className='container participants d-flex mb-1'>
                            <img className='match-bar-team-img me-0'src={`https://ddragon.leagueoflegends.com/cdn/13.15.1/img/champion/${p.championName}.png`}></img>
                            <a className='mt-1 participant-name mb-2' href={`/lol?name=${p.summonerName}`}>{p.summonerName}</a>
                        </div>
                    ))}
                     
                </div>
                <div className='container d-flex flex-column second-col '>
                    {team2.map((p) => (
                        <div className='container d-flex participants mb-1'>
                            <img className='match-bar-team-img me-0'src={`https://ddragon.leagueoflegends.com/cdn/13.15.1/img/champion/${p.championName}.png`}></img>
                            <a className='mt-1 participant-name mb-2' href={`/lol?name=${p.summonerName}`}>{p.summonerName}</a>
                        </div>
                        
                        
                    ))}
                    
                </div>


               
                <div className='container pe-5'>
                    <button onClick={toggleAdditionalInfo} className={`btn btn-match pb-5 ${showAdditionalInfo ? 'active' : ''}`}>
                        <span className='lines'></span>
                    </button>
                </div>
                
            </div>
             { showAdditionalInfo ? 
                   <div className='mt-4'>
                    <ExpandLolMatch match={match} team1={team1} team2={team2}runes={runes} obj={obj} minutes={minutes}/>
                </div> : ''
                }
        </div>
    )
}   

export default LolMatchesbar;