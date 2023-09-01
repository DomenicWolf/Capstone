import ChampDisplay from './ChampDisplay';
import './LolChampDisplaySide.css'


const LolChampDisplaySide = ({champ}) => {

    const lastSlashIndex = champ.champIcon.lastIndexOf('/');
    const pngIndex = champ.champIcon.lastIndexOf('.png');
    const extractedWord = champ.champIcon.substring(lastSlashIndex + 1, pngIndex);
    let kdaColor;
    if((champ.kills+champ.assists)/champ.deaths >= 4) kdaColor = 'green';
    else if((champ.kills+champ.assists)/champ.deaths >= 3) kdaColor = 'yellow-green';
    else if((champ.kills+champ.assists)/champ.deaths >= 2) kdaColor ='orange';
    else kdaColor = 'red'
    let wrColor;
    const wr = ((champ.gamesWon/champ.gamesPlayed) * 100).toFixed(1)
    if(wr >= 75) wrColor = 'green';
    else if(wr >= 50) wrColor = 'yellow-green';
    else if(wr > 25) wrColor ='orange';
    else wrColor = 'red'
    let csColor;
    if(champ.cs >= 9) csColor = 'green';
    else if(champ.cs >= 7) csColor = 'yellow-green';
    else if(champ.cs >= 5) csColor ='orange';
    else csColor = 'red'
    function formatNumber(number, decimalPlaces) {
        const fixedNumber = number.toFixed(decimalPlaces);
        const integerPart = parseInt(fixedNumber);
        const fractionalPart = fixedNumber - integerPart;
        
        if (fractionalPart === 0) {
          return integerPart.toString();
        } else {
          return fixedNumber;
        }
      }
    return  (
        <div className='container  d-flex justify-content-around champ-side-container pt-2'>
            <div className='champ-side-img-container'>
                <img className='champ-side-img' src={`${champ.champIcon}`}></img>
            </div>
            <div className='text-center'>
                <h4 className='champ-display-side-main-text mb-0'>{extractedWord === 'MonkeyKing' ? 'Wukong' : extractedWord}</h4>
                <h3 className={`champ-display-side-text ${csColor}`}>{(Number(champ.cs)).toFixed(1)} CS</h3> 
            </div>
           
            <div>  
                <h5 className='champ-display-side-text mb-1'>{formatNumber(champ.kills/champ.gamesPlayed,1)}/{formatNumber(champ.deaths/champ.gamesPlayed,1)}/{formatNumber(champ.assists/champ.gamesPlayed,1)}</h5>
                <h5 className={`champ-display-side-text mt- ${kdaColor}`}>{((champ.kills+champ.assists)/(champ.deaths === 0 ? 1 : champ.deaths)).toFixed(1) !== 'NaN' ? ((champ.kills+champ.assists)/champ.deaths).toFixed(1) : 0} KDA</h5>
            </div>
            <div>
                <h5 className='champ-display-side-text mb-1'>{champ.gamesWon}W {champ.gamesLost}L</h5>
                <h5 className={`champ-display-side-text ${wrColor}`}>{wr}%</h5>
            </div>
        </div>
    )
}

export default LolChampDisplaySide;