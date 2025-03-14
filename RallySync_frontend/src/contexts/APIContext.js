import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { getCsrfToken, myAxios } from '../api/myAxios';

export const APIContext = createContext(null);

export const APIProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [sajatVersenyLista, setSVL] = useState([]);
    const [helyszinLista, setHL] = useState([]);
    const [categLista, setKL] = useState([]);
    const [carLista, setCL] = useState([]);

    // Get competitions for the logged-in user
    const postCompetition = useCallback(async () => {
        if (!user) return; // Prevent fetching if there's no user
        try {
            await getCsrfToken();
            const response = await myAxios.get(`/api/competition/${user}`);
            console.log(response.data);
            setSVL(response.data);
        } catch (error) {
            console.error("Error fetching competitions:", error);
        }
    }, [user]);

    // Get locations (helyszin)
    const getHelyszin = useCallback(async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/placeGet");
            console.log(response.data);
            setHL(response.data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    }, []);

    // Get categories (kategória)
    const getKategoriak = useCallback(async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/categGet");
            console.log(response.data);
            setKL(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    const getCars = useCallback(async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/carGet");
            console.log("Fetched cars:", response.data);  // Add this log to check the response
            setCL(response.data);  // Set the car list state
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    }, []);


    useEffect(() => {
        getHelyszin();
        getKategoriak();
        getCars();
        if (user) {
            postCompetition(); 
        }
    }, [getHelyszin, getKategoriak, getCars, postCompetition, user]);

    return (
        <APIContext.Provider value={{
            sajatVersenyLista, 
            helyszinLista, 
            categLista, 
            carLista,
            postCompetition,
            getHelyszin,
            getKategoriak,
            getCars
        }}>
            {children}
        </APIContext.Provider>
    );
};

export default APIContext;
