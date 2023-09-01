import './LolExpandTeam.css'
import r8000 from  './Styles/8000.png';
import rune8100  from './Styles/8100.png';
import rune8200 from './Styles/8200.png';
import rune8300 from './Styles/8300.png';
import rune8400 from './Styles/8400.png';

const LolExpandTeam = ({team,runes,obj,minutes}) => {
    team = team.map(player => {
        const items = [
          player.item0,
          player.item1,
          player.item2,
          player.item3,
          player.item4,
          player.item5,
          player.item6
        ]; return {
            ...player,
            items: items,
          };
        });
    const sumSpellUrl = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/img/spell/'
    console.log(team,1)
    console.log(minutes)
    const expandColor = team[0].teamId === 200 ? 'expand-red' : 'expand-blue'
    return(
        <div className="container">
            <div className='container d-flex justfity-content-between expand-top-names'>
                <p className='expand-top-info'>SUMMONER</p>
                <p className='expand-top-info'> ITEMS</p>
                <p className='expand-top-info expand-top-kda'> KDA</p>
                <p className='expand-top-info expand-top-cs'> CS</p>
               <p className='expand-top-info'>DAMAGE</p>
                     
                    
                     
                
              
                 
               
                
            </div>
            {team ? 
                team.map((p) => (

                    <div className={`row expand-box ${expandColor}`}>
                        <div className="col-md-3 text-start expand-info-container">
                            <div className='d-flex '>
                                <div className='row me-0'>

                                    <div className='col-sm-1 mt-2'>
                                        <img  className='expand-champ-img' src={`https://ddragon.leagueoflegends.com/cdn/13.15.1/img/champion/${p.championName === 'FiddleSticks' ? 'Fiddlesticks' : p.championName}.png`} ></img>
                                    </div>

                                    <div className='col-sm-1 pe-0 '> 
                                        <img className='expand-sum-img' src={`${sumSpellUrl}${obj[(p.summoner1Id).toString()]}.png`}></img>
                                        <img className='expand-sum-img mb--1' src={`${sumSpellUrl}${obj[(p.summoner2Id).toString()]}.png`}></img>
                                    </div>

                                    <div className='col-sm-1 pe-0 mr-1'>
                                        <img className='expand-rune-img me-0' src={runes[(p.rune1).toString()]}></img>
                                        <img className='expand-rune-img mb--1' src={runes[(p.rune2).toString()]}></img>
                                    </div>

                                    <div className='col-sm-7 d-flex align-items-center expand-name-container'>
                                        <p className="expand-name">{p.summonerName}</p>
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className='decorative-lol-expand'></div>
                        <div className='col-md-5 d-flex text-center item-kda-cs-container'>
                            

                            <div className='expand-items container'>
                                {p.items.map(i => (
                                     i !== 0 ? <img className='expand-item ' src={`https://ddragon.leagueoflegends.com/cdn/13.15.1/img/item/${i}.png`}></img> : <div className='empty me-1 mt-0'></div>
                                ))}
                            </div>
                            <div className='container text-center expand-kda-contanier'>
                                <p className='expand-kda'>{p.kills}/{p.deaths}/{p.assists}</p>
                                <p className='expand-kda-calc'>{((p.kills + p.assists)/p.deaths).toFixed(1)}</p>
                            </div>
                            <div>
                                <p className='expand-cs'>{p.totalMinionsKilled + p.totalAllyJungleMinionsKilled + p.totalEnemyJungleMinionsKilled}</p>
                                <p className='expand-cs-min'>{((p.totalMinionsKilled + p.totalAllyJungleMinionsKilled + p.totalEnemyJungleMinionsKilled)/minutes).toFixed(1)}</p>
                            </div>

                        </div>
                        <div className='decorative-lol-expand'></div>
                        <div className='col-md-3 d-flex text-center'>
                                <div className='damage-container d-flex'>
                                    <p className='damage-p'>Dealt: {p.totalDamageDealtToChampions}</p>
                                    <p className='damage-p'>Taken: {p.totalDamageTaken}</p>
                                </div>
                        </div>
                        <div className='decorative-lol-expand'></div>
                    </div>
                )) : ''}

             
        </div>
    )
}

export default LolExpandTeam;