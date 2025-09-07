import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true ///send theh cookies with the request
})