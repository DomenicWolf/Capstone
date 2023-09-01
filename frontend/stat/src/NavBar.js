import {NavLink} from "react-router-dom";
import TrueStat from './TrueStatLogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import lol  from './lol.png'
import tft from  './tft.png'
import val from './val.png'
import destiny from './destiny (2).png'
import { useLocation,useNavigate } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
    const location = useLocation();
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
        e.preventDefault()
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
    return (
        <div>
            {/* <br></br> */}
        
        <nav className="navbar block" style={{ backgroundColor: "whitesmoke" }} >
            <div className="container-fluid d-flex justify-content ">
                <a className="navbar-brand" href="#"><img src={TrueStat} height={100}></img></a>
                {location.pathname  !== '/' ? 
                <form className="d-flex justify-content-start" role="search" onSubmit={handleSubmit}>
                    <input className="form-control me-2 pe-5 nav-form" type="search" placeholder="Search for player..." aria-label="Search" value={formData.playerName} name='playerName' onChange={handleChange}/>
                    <button className="btn btn-outline-dark" type="submit">Search</button>
                </form>
                :
                ''}
                <div className="justify-content text-start">
                <ul className="nav">
                    <li className="nav-item btn btn-purple btn-xs me-2 p-1">
                        <a className="nav-link p-1" href="/"><img src={lol} height={20} width={40}/>League Of Legends</a>
                    </li>
                    <li className="nav-item  btn btn-purple btn-xs me-2">
                        <a className="nav-link p-0" href="/"><img src={tft} height={32} width={35}/>Teamfight Tactics</a>
                    </li>
                    <li className="nav-item btn btn-purple btn-xs me-2 pl-0 ps-0">
                        <a className="nav-link p-0" href="/"><img src={val} height={30} width={40}/>Valorant</a>
                    </li>
                    <li className="nav-item btn btn-purple btn-xs me-2 ps-0">
                        <a className="nav-link p-0" href="/"><img src={destiny} height={30} width={40}/>Destiny 2</a>
                    </li>
                </ul>
                </div>
            </div>
      </nav>
      </div>
    )
}

export default NavBar;