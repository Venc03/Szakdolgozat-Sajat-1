 import React from "react";
import { Outlet } from "react-router-dom";
import NavigacioVendeg from "../navigations/NavigacioVendeg";
import Galeria from "../pages/Vendeg/Galeria";

export default function VendegLayout() {
    return (
        <>
            <NavigacioVendeg />
            <Outlet />
        </>
    );
} 
