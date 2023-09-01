import './ChampDisplay.css'

const ChampDisplay = ({champ}) => {
    console.log(champ)
    const lastSlashIndex = champ.champIcon.lastIndexOf('/');
    const pngIndex = champ.champIcon.lastIndexOf('.png');
    const extractedWord = champ.champIcon.substring(lastSlashIndex + 1, pngIndex);
    let wrColor;
    let wr = (champ.gamesWon/champ.gamesPlayed * 100).toFixed(1)
    if(wr >= 75) wrColor = 'green';
    else if(wr >= 50) wrColor = 'yellow-green';
    else if(wr > 25) wrColor ='orange';
    else wrColor = 'red'
    return (
        // <div className="container-fluid d-flex">
        //     <div className="container champ-img-container pe-0">
        //         <img className='champ-img' src={champ.champIcon}></img>
        //         <h2 className='player-page-text'>{extractedWord === 'MonkeyKing' ? 'Wukong' : extractedWord}</h2>
        //     </div>
            
        //     <div>
        //         <h2 className="player-page-text">{champ.gamesWon}W</h2>
        //         <h2 className='player-page-text'>{champ.gamesLost}L</h2>
        //         <h2 className={wrColor}>{wr}%</h2>
        //     </div>
        // </div>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6 champ-img-container pe-0">
                    <img className='champ-img img-fluid' src={champ.champIcon} alt="Champion Icon" />
                    <h2 className='player-page-text'>{extractedWord === 'MonkeyKing' ? 'Wukong' : extractedWord}</h2>
                </div>
        
                <div className="col-md-6">
                    <h2 className="player-page-text">{champ.gamesWon}W</h2>
                    <h2 className='player-page-text'>{champ.gamesLost}L</h2>
                    <h2 className={wrColor}>{wr}%</h2>
                </div>
            </div>
        </div>

    )
}

export default ChampDisplay