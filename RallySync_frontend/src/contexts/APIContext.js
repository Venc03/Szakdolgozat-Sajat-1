import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { getCsrfToken, myAxios } from '../api/myAxios';

export const APIContext = createContext(null);

export const APIProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [sajatVersenyLista, setSVL] = useState([]);
    const [helyszinLista, setHL] = useState([]);
    const [categoryLista, setKL] = useState([]);

    const getMyCompetitions = async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get(`/api/competition/${user}`);
            console.log(response.data)
            setSVL(response.data)
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    const getHelyszin = async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/placeGet");
            console.log(response.data)
            setHL(response.data)
        } catch (error) {
            console.error("Hiba:", error);
        }
      };

    const postCompetition = async (data) => {
        try {
            await getCsrfToken();
            const response = await myAxios.post("/api/competitions", data); 
            console.log("Sikeres feltöltés:", response.data);
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    const getKategoriak = async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/categGet");
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
    return (<APIContext.Provider value={{ sajatVersenyLista, helyszinLista, categoryLista, postCompetition, getHelyszin}}>{children}</APIContext.Provider>)
}
export default APIContext