import pic from './test11.png'
import pic2 from './teemo.png'
import './LolHome.css'
import lol  from './lol.png'
import TrueStat from './TrueStat.png'
import { useState,useEffect } from 'react'
import StatApi from './api'
import axios from 'axios'
import PlayerHomeDisplay from './PlayerHomeDisplay'
import challenger from './challenger.png'
import { Navigate, useNavigate } from 'react-router-dom'


const LolHome = () => {
    const navigate = useNavigate();
    const INITIALSTATE = {
       playerName:''
    }
    const [formData,setFormData] = useState(INITIALSTATE)
    const handleChange = e => {
        const {name,value} = e.target
        setFormData(data => ({
            ...data,
            [name]: value
        }))
    }

    const handleSubmit = async  e => {
        e.preventDefault();
        const {playerName} = formData;
        setFormData(INITIALSTATE)
        try {
            // const player = await StatApi.getLolPlayerData(playerName)
            
        }catch(e){
            alert()
            console.error(e)
        }
        return navigate(`/lol-player-page?name=${encodeURIComponent(playerName)}`);
    }
    const [topThree, setTopThree] = useState([]);

    async function getTopThree() {
        try {
            const data = await StatApi.getLolHomePlayer();
            setTopThree(data.data.highest);
        } catch (error) {
            console.error("Error fetching top three:", error);
        }
    }

    useEffect(() => {
        getTopThree();
    }, []);
    return (
        <div>

        
        {topThree.length !== 0 ?
        <div className='container text-center lol-home'>
            
            <div className='container lol-home-title-container  d-flex justify-content-center align-items-center row'>
                
                <div className='lol-home-title '>
                    <div className='lol-home-title-main'>
                                            <h1>LEAGUE OF LEGENDS STATS</h1>
                    <p className='lol-title-desc'>FInd Your Summoner</p>
                    </div>

                </div>
                {/* <img className='lol-title-logo' src={lol}></img> */}
                
                
                
                
            </div>
            <div className='lol-home-background-container row full-width-row'>
             
                
              <div className='container content-container text-end mb-0 mt-5'>
              
                    <img className='teemo-1'src={pic2}></img> 
               
                
                <img className='truestat-logo' src={pic} height={100}></img>
            </div>
         <div className='section-container container   search-form-container'>
           
            <form className='content-container pt-5 search-form-container' onSubmit={handleSubmit}>
                <div className="container d-flex search-form-container" >
                    <label><img height={30} width={60} src={lol}/></label>
                    {/* <span className="input-group-text input search-form" id="inputGroup-sizing-sm input "><img height={30} width={60} src={lol}/></span> */}
                    <input type="text" className="form-control  form-control whitesmoke form-focus search-form " placeholder="  Search for Summoner..." value={formData.playerName} name='playerName' onChange={handleChange}/>
                    
                </div>
            </form>
            <br/>
            
        </div> 

       
               
               
          
            
            <div className='container lol-home-container-title d-flex justfiy-content-between '>
                <div className='lol-home-leaderboard-title-container '>
                    <p className='lol-home-leaderboard-title'>North America</p>
                </div>
                <div className='lol-home-leaderboard-title-container '>
                    <p className='lol-home-leaderboard-title'>North America</p>
                </div>
                <div className='lol-home-leaderboard-title-container '>
                    <p className='lol-home-leaderboard-title'>North America</p>
                </div>
                
            </div>
           
          <div className='container d-flex justify-content content-container text-center mt-0'>
          
           {topThree.map((player) => (
            
                <PlayerHomeDisplay player={player}/>
           ))}  
    
           </div>
             
        </div>  </div> : 
                <div className='container  loading-img-home'>
                    <img className='home-loading-img'src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazg1bmU3NDg4Y2Rza2c0a2tyZnNjZ3EwNzk0MXFtZTB2MTU2Y3VyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIP73vEZmJjFNXtC/giphy.gif' height={200}></img>
                </div>
            }</div>
    )
}

export default LolHome;