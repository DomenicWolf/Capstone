import './Home.css'
import TrueStat from './TrueStatLogo.png'
import pic from './test11.png'


const Home = () => {


    return (
        <div className='home-main-container'>
            <div className='row'>
                <div className='container col-md-6 text-center game-section'>
                    <div className=''>
                       <h1 className='mb-5 mt-4 home-title-h1'>ALL GAMES</h1> 
                    </div>
                    
                    <div className='row'>
                        <div className='col-xl-3 home-games-img'>
                            <div>
                                <a href='/lol-home' className='home-lol-img'></a>
                            </div>

                            <div>
                                <a href='/tft-home' className='home-tft-img mt-3'></a>
                            </div>
                        </div>
                        <div className= 'col-xl-3 home-games-img'>
                            <div>
                                <a href='/valorant-home' className='home-valorant-img'></a>
                            </div>
                            
                            <div>
                                <a href='/destiny-home' className='home-destiny-img  mt-3'/>
                            </div>
                        </div>
                        <div className= 'col-xl-3 home-games-img'>
                            <div>
                                <a href='/cs-home' className='home-cs-img'></a>
                            </div>
                            
                            <div>
                                <a href='/halo-home' className='home-halo-img mt-3'/>
                            </div>
                        </div>
                        <div className= 'col-xl-3 home-games-img'>
                            <div>
                                <a href='/rocket-league-home' className='home-rl-img'></a>
                            </div>
                            
                            <div>
                                <a href='/apex-legends-home' className='home-apex-img mt-3'/>
                            </div>
                        </div>
                    </div>
                   
                </div>
                <div className='container col-md-6 home-desc-container text-center'>
                    <div className='container home-logo-container'>
                        <img className='home-logo' src={TrueStat}/>
                    </div>
                    <h2  className='home-desc mb-5'>
                        IMPROVE YOUR GAME WITH IN-DEPTH STAT ANALYSIS...
                    </h2>
                    <h2 className='home-desc-2 mt-5'>
                        WITHOUT THE ADS
                    </h2>
                    <div className=''>
                    <img className='home-truestat-logo mt-3'src={pic}></img>
                </div>
                </div>
            </div>
            <div className='row'>
                
                
            </div>
        </div>
    )
}

export default Home;