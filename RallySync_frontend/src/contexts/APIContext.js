import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { myAxios } from '../api/axios';

export const APIContext = createContext(null);

export const APIProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [sajatVersenyLista, setSVL] = useState([]);
    const [helyszinLista, setHL] = useState([]);
    const [categoryLista, setKL] = useState([]);

    const getMyCompetitions = async () => {
        try {
            const response = await myAxios.get(`/api/competition/${user}`);
            console.log(response.data)
            setSVL(response.data)
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    const getHelyszin = async () => {
        try {
            const response = await myAxios.get("/api/places");
            console.log("Helyszínek: ", response.data)
            setHL(response.data)
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    const postCompetition = async (data) => {
        try {
            const response = await myAxios.post("api/competition", data); // POST kérést küldünk
            console.log("Sikeres feltöltés:", response.data);
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    const getKategoriak = async () => {
        try {
            const response = await myAxios.get("api/categories");
            console.log(response.data)
            setKL(response.data)
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    useEffect(() => {
        getHelyszin();
        getKategoriak();
    }, [])
    return (<APIContext.Provider value={{ sajatVersenyLista, helyszinLista, categoryLista, postCompetition }}>{children}</APIContext.Provider>)
}
export default APIContext