// create an instance to be used for application

import axios from "axios";

const API_URL = "https://slack-api.replit.app/api/v1";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});