import pic from './test11.png'
import pic2 from './teemo.png'
import './Home.css'
import lol  from './lol.png'
import TrueStat from './TrueStat.png'
import { useState,useEffect } from 'react'
import StatApi from './api'
import axios from 'axios'
import PlayerHomeDisplay from './PlayerHomeDisplay'
import challenger from './challenger.png'
import { Navigate, useNavigate } from 'react-router-dom'


const Home = () => {
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
        return navigate(`/lol?name=${encodeURIComponent(playerName)}`);
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
        <div className='container text-center'>
              <div className='container content-container text-end mb-0 mt-5'>
               <img src={pic} height={100}></img> 
            </div>
        <div className='section-container container   search-form'>
            {/* <div className='container text-center mb-3'>
               <h1 className='title'>League Of legends</h1> 
            </div> */}
            <form className='content-container pt-5 search-form' onSubmit={handleSubmit}>
                <div className="container d-flex search-form" >
                    <label><img height={30} width={60} src={lol}/></label>
                    {/* <span className="input-group-text input search-form" id="inputGroup-sizing-sm input "><img height={30} width={60} src={lol}/></span> */}
                    <input type="text" className="form-control  form-control-sm whitesmoke form-focus search-form " placeholder="Search for player..." value={formData.playerName} name='playerName' onChange={handleChange}/>
                    
                </div>
            </form>
            <br/>
            {/* <div className='container d-flex justify-content-center mt-4 ml-2 teemo'>
               <img src={pic2} height={200} width={350}></img> 
            </div> */}
        </div>
            {/* <h1>leaderboard</h1> */}
            {/* <div className='container d-flex justify-content content-container text-center challenger'>
                <img src={challenger}></img>
            </div> */}
          <div className='container d-flex justify-content content-container text-center mt-5'>
          
           {topThree.map((player) => (
            
                <PlayerHomeDisplay player={player}/>
           ))}  
    
           </div>
             {topThree.length !== 0 ? '' : 
                <div className='container  loading-img-home'>
                    <img className='home-loading-img'src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazg1bmU3NDg4Y2Rza2c0a2tyZnNjZ3EwNzk0MXFtZTB2MTU2Y3VyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIP73vEZmJjFNXtC/giphy.gif' height={200}></img>
                </div>
            }
        </div>
    )
}

export default Home;