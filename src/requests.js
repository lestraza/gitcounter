import axios from 'axios';


export function getRepository (url) {    
    return axios.get(url)
}

export function buildLink (link) {
    const str = link.split('/')

    const adress = str.slice(-2)
    
    const contentLink = `https://api.github.com/repos/${adress[0]}/${adress[1]}/contents`

    return contentLink
}

export function getComments (url){
    return axios.get(url)
}