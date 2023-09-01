const axios = require('axios')


async function getThing() {
    const baseUrl = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/summoner.json'

    const data = await axios.get(baseUrl);
    const results = data.data.data
    const obj = {}
    for(let d in results){
        const key = results[d].key
        const id =results[d].id
        console.log(key,id)
        obj[key] = id
    }
    console.log(obj)
}

async function lookingForProfile() {
    const url = 'http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/profileicon.json';

    const data = await axios.get(url);
    const results =  data.data.data
    console.log(results)
}

lookingForProfile()