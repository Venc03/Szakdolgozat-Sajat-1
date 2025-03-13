import axios from "axios";

export const myAxios = axios.create({
    baseURL: "http://localhost:8000", // Backend base URL
    withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to add CSRF token to headers
myAxios.interceptors.request.use(
    (config) => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1];
        if (token) {
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
        }
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);
