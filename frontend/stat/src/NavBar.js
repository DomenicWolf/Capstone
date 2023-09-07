import {NavLink} from "react-router-dom";
import TrueStat from './TrueStatLogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

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
    const [showMenu, setShowMenu] = useState(false); 

    const toggleMenu = () => {
      setShowMenu(!showMenu); 
    };
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
        return navigate(`/lol-player-page?name=${encodeURIComponent(playerName)}`);
    }
    return (
        <div>
            {/* <br></br> */}
        
        <nav className="navbar block navbar-expand-lg" style={{ backgroundColor: "whitesmoke" }} >
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <a className="navbar-brand" href="/"><img src={TrueStat} height={100}></img></a>
                {location.pathname.includes('lol-player-page')? 
                <form className="d-flex justify-content-start nav-search" role="search" onSubmit={handleSubmit}>
                    <input className="form-control me-2 pe-5 nav-form" type="search" placeholder="Search for player..." aria-label="Search" value={formData.playerName} name='playerName' onChange={handleChange}/>
                    <button className="btn btn-outline-dark nav-search-button" type="submit">Search</button>
                </form>
                :
                ''
                }
                 <button class={`navbar-toggler ${showMenu ? 'nav-hamburger' : 'show'}`} type="button" data-toggle="collapse" data-target="#navbarNav" onClick={toggleMenu}>
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse text-align-end ${showMenu ? 'show' : ''}`} id="navbarNav">
                <ul className="nav navbar-nav ml-auto d-flex">
                    <li className="nav-item btn btn-purple btn-xs me-2 p-1">
                        <a className="nav-link p-1" href="/lol-home"><img src={lol} height={20} width={40}/>League Of Legends</a>
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