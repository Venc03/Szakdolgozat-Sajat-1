import React from 'react'
import { Outlet } from 'react-router';
import NavigacioSzervezo from '../navigations/NavigacioSzervezo';

function SzervezoLayout() {
    return (
        <>
            <NavigacioSzervezo />
            <Outlet />
        </>
    );
}

export default SzervezoLayout
