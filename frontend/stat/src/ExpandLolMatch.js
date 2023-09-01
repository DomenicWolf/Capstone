import './ExpandLolMatch.css'
import LolExpandTeam from './LolExpandTeam'

const ExpandLolMatch = ({match,team1,team2,runes,obj,minutes}) => {

    console.log(match.matchDetails[0].teams[0].objectives)
    return (
        <div className='container expand-main'>
            <div className='container team1-parent mt-2 mb-2'>
                <LolExpandTeam team={team1} runes={runes} obj={obj} minutes={minutes}/>
            </div>
            <div className='container expand-stats'>
                <div className='row'>
                    <div className='container col-md-4'>
                        <div className='container d-flex'>
                           <img className='dragon-img' src='https://lplol.pt/system/teams/avatars/000/000/002/original/wd21.png?1622129070'></img> 
                           <p className='team-blue'>{match.matchDetails[0].teams[0].objectives.dragon.kills}</p>

                           <img className='tower-img' src='http://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/537.png'></img>
                           <p className='team-blue'> {match.matchDetails[0].teams[0].objectives.tower.kills}</p>

                           <img className='baron-img'src='http://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/839.png'></img>
                           <p className='team-blue'> {match.matchDetails[0].teams[0].objectives.baron.kills}</p>
                        </div>
                        
                    </div>
                    <div className='container col-md-4'>
                        <img className='dragon-img' src='https://lplol.pt/system/teams/avatars/000/000/002/original/wd21.png?1622129070'></img>
                    </div>
                    <div className='container col-md-4'>
                        <div className='container d-flex'>
                            <img className='dragon-img' src='https://lplol.pt/system/teams/avatars/000/000/002/original/wd21.png?1622129070'></img> 
                            <p className='team-red'>{match.matchDetails[0].teams[1].objectives.dragon.kills}</p>

                            <img className='tower-img' src='http://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/537.png'></img>
                            <p className='team-red'> {match.matchDetails[0].teams[1].objectives.tower.kills}</p>

                            <img className='baron-img'src='http://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/839.png'></img>
                            <p className='team-red'> {match.matchDetails[0].teams[1].objectives.baron.kills}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container team2-parent'>
                <LolExpandTeam team={team2} runes={runes} obj={obj} minutes={minutes}/>
            </div>
        </div>
    )
}

export default ExpandLolMatch;