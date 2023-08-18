const axios = require('axios');
const db = require("./db");

async function champScript() {
    const req = await axios.get('http://ddragon.leagueoflegends.com/cdn/13.15.1/data/en_US/champion.json')
    const data = req.data;
    const url = 'https://ddragon.leagueoflegends.com/cdn/13.15.1/img/champion/';
    const champs = Object.keys(data.data);
    for (let champ of champs) {
        //console.log(`${url}${champ}.png`)
        console.log(champ)
        db.query(
            `INSERT INTO champs (champ_id, champ_name, champ_icon)
            VALUES
            ('${data.data[champ].key}', '${champ}', '${url}${champ}.png')`
        );
        
        // console.log(data.data[champ])
    }
    console.log('DONE WITH CHAMPS')
        return undefined
}

async function itemsScript() {
    const req = await axios.get('http://ddragon.leagueoflegends.com/cdn/13.15.1/data/en_US/item.json')
    const data = req.data;
    const url = 'https://ddragon.leagueoflegends.com/cdn/13.15.1/img/item/';
    const items = Object.keys(data.data);
    for (let item of items) {
       // console.log(`${url}${item}.png`)
       // console.log(data.data[item].description)
        // const itemStats = JSON.stringify(data.data[item].stats);


        function stripHtmlTags(htmlString) {
            return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
        }
        
        const itemDescription = data.data[item].description;
        const cleanedDescription = stripHtmlTags(itemDescription);
      
       

        db.query(
            `INSERT INTO items (item_id, item_name, item_icon,item_gold,item_desc)
            VALUES
            ($1,$2,$3,$4,$5)`,
            [item, data.data[item].name, `${url}${item}.png`, data.data[item].gold.total,cleanedDescription]
            
        );
        
        
        // console.log(data.data[champ])
    }
    console.log('DONE WITH ITEMS')
    return undefined
}

async function runeScript() {
    const req = await axios.get('http://ddragon.leagueoflegends.com/cdn/13.15.1/data/en_US/runesReforged.json');
    const data = req.data;
    const url = 'https://ddragon.canisback.com/img/';
    const items = Object.keys(data);
    
    for(let item of items){
        let number;
        if(data[item].id === 8000){
            number = 7201;
        }else if(data[item].id === 8100){
            number = 7200
        }else if(data[item].id === 8200){
            number = 7202
        }else if(data[item].id === 8300){
            number = 7203
        }else {
            number = 7204
        }
        db.query(
            `INSERT INTO runes (rune_id,rune_name,rune_icon,rune_icon_number)
            VALUES
            ($1,$2,$3,$4)`,
            [data[item].id,data[item].name,`${url}${data[item].icon}`,number]
            
        );
    }
    console.log('DONE WITH RUNES');
    return undefined;
}

async function summonerSpellScript() {
    const req = await axios.get('http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/summoner.json');
    const data = req.data.data;
    const url = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/img/spell/';
    const items = Object.keys(data);

    for(let item of items){
        db.query(
            `INSERT INTO sum_spells (sum_id,sum_name,sum_icon,sum_desc)
            VALUES
            ($1,$2,$3,$4)`,
            [data[item].id,data[item].name,`${url}${data[item].image.full}`,data[item].description]
            
        );
    }
    console.log('DONE WITH SUMMONER SPELLS');
    return undefined;
}

async function profileScript() {
    const req = await axios.get('http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/profileicon.json');
    const data = req.data.data;
    const url = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/img/profileicon/';
    const items = Object.keys(data);

    for(let item of items){
        db.query(
            `INSERT INTO profile_icons (profile_id,profile_icon)
            VALUES
            ($1,$2)`,
            [item,`${url}${data[item].image.full}`]
            
        );
    }

    console.log('DONE WITH PROFILE ICONS')
    return undefined;
}

async function rankScript() {
    const ranks = ['iron','bronze','silver','gold','platinum','emerald','diamond','master','grandmaster','challenger'];
    const url = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-';
    for(let rank of ranks){
        db.query(
            `INSERT INTO rank_icons (rank_name,rank_icon)
            VALUES
            ($1,$2)`,
            [rank,`${url}${rank}.png`]
            
        );
    }
    console.log('DONE WITH RANKS')
    return undefined;
}
rankScript()
summonerSpellScript()
itemsScript()
champScript()
runeScript()
profileScript()