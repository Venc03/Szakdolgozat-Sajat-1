import { createContext, useContext, useEffect, useState } from "react";
import { getCsrfToken, myAxios } from "../api/myAxios";
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


    const getUser = async () => {
        try {
            await getCsrfToken();
            const { data } = await myAxios.get(`/api/user`);
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };
    

    const logout = async () => {
        try {
            await getCsrfToken();
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
        try {
            await getCsrfToken();
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
        <AuthContext.Provider value={{ user, logout, loginReg, errors, getUser, setUser }}>
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
