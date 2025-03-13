import React, { createContext, useContext, useState } from 'react'
import useAuthContext, { AuthContext } from './AuthContext';
import { myAxios } from '../api/axios';
import APIContext from './APIContext';

export const SzervezoContext = createContext(null);

export const SzervezoProvider = ({children}) =>
    {
        
        
        return ( <SzervezoContext.Provider value={{}}>{children}</SzervezoContext.Provider> )
    }
export default SzervezoContext