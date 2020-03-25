import axios from 'axios';

export const auth = 'client_id=97cec6e85dc5b333793e&client_secret=67eb654765fc6a7409e0d292b67f184b66ee86bb';

export function getRepository(url) {
    return axios.get(url)
}

export function buildLink(link) {
    const str = link.split('/')

    const adress = str.slice(-2)

    const contentLink = `https://api.github.com/repos/${adress[0]}/${adress[1]}/contents?${auth}`

    return contentLink
}

