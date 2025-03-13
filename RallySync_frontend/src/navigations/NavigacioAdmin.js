import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from '../contexts/AuthContext';

function NavigacioAdmin() {
    const { logout } = useAuthContext();
    return (
        <nav className="navbar navbar-expand-sm bg-light">
        <div className="container-fluid">
            <ul className="navbar-nav d-flex w-100 justify-content-between">
                <li className="navbar-item ms-2">
                    <Link className="nav-link" to="./versenyek">
                    TEST
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link className="nav-link" to="./galeria">
                        TEST
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link className="nav-link" to="./kapcsolat">
                    TEST
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link className="nav-link" to="/">
                    TEST
                    </Link>
                </li>                    
                <li className="navbar-item ms-2">
                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => {
                                logout();
                            }}
                        >
                            Kijelentkezés
                        </button>
                    </li>
            </ul>
            
        </div>
    </nav>
    )
}

export default NavigacioAdmin
