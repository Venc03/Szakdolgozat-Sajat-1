import axios from "axios";

export const myAxios = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true, 
});

// Function to ensure CSRF token is set
export const getCsrfToken = async () => {
    try {
        await myAxios.get("/sanctum/csrf-cookie");
        console.log("CSRF token set");
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
    }
};

// Request interceptor to add CSRF token
myAxios.interceptors.request.use(
    async (config) => {
        if (!config.headers["X-XSRF-TOKEN"]) {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            if (token) {
                config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
            }
        }
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);
