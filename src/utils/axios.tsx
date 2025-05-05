import axios from 'axios';

export const baseURL = 'https://backend-hb.onrender.com/';

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;
