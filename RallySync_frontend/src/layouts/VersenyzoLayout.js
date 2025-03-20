import React from 'react'
import NavigacioVersenyzo from '../navigations/NavigacioVersenyzo';
import { Outlet } from 'react-router';

function VersenyzoLayout() {
    return (
        <>
            <NavigacioVersenyzo />
            <Outlet />
        </>
    );
}

export default VersenyzoLayout
