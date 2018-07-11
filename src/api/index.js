import {
    resolve
} from "upath";
import axios from 'axios'

const api = 'http://localhost:3001'


const getDate = ({
    url,
    method = 'get',
    data = {}
} = {}) => {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: api + url,
            data
        }).then((data) => {
            console.log(data.data)
            resolve(data.data)
        }).catch((err) => {
            reject(err)
        })
    })
}

export async function getItem() {
    return await getDate({
        url: '/result'
    })
}