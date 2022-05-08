import axios from 'axios'
import store from '../store/index'

axios.defaults.baseURL = 'http://95.213.165.3:5000/api'

export async function query({method, query, params}) {
    const config = {
        token: localStorage.getItem('token')
    }

    let response = null
    try {
        if (method === 'get') {
            response = await axios.get(query, {params: Object.assign(config, params) })
        } else if (method === 'post') {
            response = await axios.post(query, Object.assign(config, params))
        }
    } catch (e) {
        store.commit('setError', e.response.data.message)
        return e.response.status;
    }

    return response
}
