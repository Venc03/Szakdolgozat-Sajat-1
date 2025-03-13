import React from 'react'
import NavigacioAdmin from '../navigations/NavigacioAdmin';
import { Outlet } from 'react-router';

function AdminLayout() {
    return (
        <div>
            <NavigacioAdmin />
            <Outlet />
        </div>
    );
}

export default AdminLayout
