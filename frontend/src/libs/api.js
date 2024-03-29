import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

API.interceptors.request.use((config) => {
    const token = localStorage["AccessToken"];

    if (!config.env.noLoader) 
        window.setLoader(true);

    if (token)
        config.headers.Authorization = "Token " + token;

    return config;
});

API.interceptors.response.use(async (response) => {
    window.setLoader(false);

    return response;
}, (error) => {
    window.setLoader(false);

    if (error.response?.status === 401)
        window.logOut();

    return Promise.reject(error);
});

export default API;
