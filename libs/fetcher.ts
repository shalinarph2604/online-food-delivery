import axios from 'axios'

const fetcher = async (url: string) => {
    return axios.get(url, { withCredentials: true }).then((res) => res.data);
}

export default fetcher;