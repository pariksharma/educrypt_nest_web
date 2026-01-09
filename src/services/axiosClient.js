import { getUserData } from "@/utils/loginUserData";
import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


// Axios request interceptor to add dynamic headers
axiosClient.interceptors.request.use(async (req) => {
    const jwt = typeof window !== "undefined" ? localStorage.getItem('token') : "";
    const user_id = typeof window !== "undefined" ? (getUserData() ? getUserData()?.user_id : "") : "";
    const app_id = 12;  // Ensure appId is fetched before request

    const headers = {
        'user_id': user_id ? user_id : 0,
        'platform ': 3,
        'Version': 1,
        'Lang': 1,
        "app_id": app_id || '', // Use the fetched or stored appId
        // "User-Agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    };

    if(jwt) headers['Authorization'] = `Bearer ${jwt}`;
    if (typeof window === "undefined") {
        headers["User-Agent"] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
    }

    req.headers = { ...req.headers, ...headers };  // Merge headers with existing headers

    return req;
}, (error) => Promise.reject(error));

export default axiosClient;