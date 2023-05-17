import axios from "axios";

let API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

API.interceptors.request.use((config) => {
    const token = localStorage["AccessToken"];

    if (token)
        config.headers.Authorization = "Bearer " + token;

    return config;
});

export default API;
