import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        permission: "",
    });

    const csrf = () => myAxios.get("/sanctum/csrf-cookie");

    const getUser = async () => {
        try {
            const { data } = await myAxios.get(`/api/user`);
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const logout = async () => {
        await csrf();
        try {
            await myAxios.post("/logout");
            setUser(null);
            navigate("/bejelentkezes");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            getUser()
        }
    }, [])

    const loginReg = async ({ ...adat }, vegpont) => {
        await csrf();
        try {
            await myAxios.post(vegpont, adat);
            await getUser();
            navigate("/");
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout, loginReg, errors, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext-et egy AuthProvider-en belül kell használni.");
    }
    return context;
}
