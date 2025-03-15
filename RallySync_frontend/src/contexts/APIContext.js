import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { getCsrfToken, myAxios } from '../api/myAxios';

export const APIContext = createContext(null);

export const APIProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [sajatVersenyLista, setSVL] = useState([]);
    const [helyszinLista, setHL] = useState([]);
    const [categLista, setKL] = useState([]);
    const [carList, setCL] = useState([]);
    const [brandtypeLista, setBTL] = useState([]); 
    const [statusLista, setSL] = useState([]); 

    // Get competitions for the logged-in user
    const postCompetition = useCallback(async () => {
        if (!user) return; 
        try {
            await getCsrfToken();
            const response = await myAxios.get(`/api/competition/${user}`);
            console.log(response.data);
            setSVL(response.data);
        } catch (error) {
            console.error("Error fetching competitions:", error);
        }
    }, [user]);

    // Get place 
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

    // Get categories
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

    // Get cars
    const getCars = useCallback(async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/carGet");
            console.log("Fetched cars:", response.data); 
            setCL(response.data); 
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    }, []);

    // Get brandtypes
    const getBrandtype = useCallback(async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/brandtypeGet");
            console.log(response.data);
            setBTL(response.data);
        } catch (error) {
            console.error("Error fetching brandtypes:", error.response?.data?.message);
        }
    }, []);

    // Get brandtypes
    const getStatus = useCallback(async () => {
        try {
            await getCsrfToken();
            const response = await myAxios.get("/api/statusGet");
            console.log(response.data);
            setSL(response.data);
        } catch (error) {
            console.error("Error fetching status:", error.response?.data?.message);
        }
    }, []);

    useEffect(() => {
        getHelyszin();
        getKategoriak();
        getCars();
        getBrandtype();
        getStatus();
        if (user) {
            postCompetition(); 
        }
    }, [getHelyszin, getKategoriak, getCars, getBrandtype, getStatus, postCompetition, user]);

    return (
        <APIContext.Provider value={{
            sajatVersenyLista, 
            helyszinLista, 
            categLista, 
            carList,
            brandtypeLista, 
            statusLista,
            postCompetition,
            getHelyszin,
            getKategoriak,
            getCars,
            getBrandtype,
            getStatus
        }}>
            {children}
        </APIContext.Provider>
    );
};

export default APIContext;
