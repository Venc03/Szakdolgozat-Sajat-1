import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";

export default function Navigacio() {
  const { user, logout } = useAuthContext();

  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav d-flex w-100 justify-content-between">
          <li className="navbar-item ms-2">
            <button type="button" className="btn btn-outline-primary w-100">
              <Link className="nav-link" to="/">
                Kezdőlap
              </Link>
            </button>
          </li>
          {user ? (
            <>
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
            </>
          ) : (
            <>
              <li className="navbar-item ms-2">
                <button type="button" className="btn btn-outline-primary w-100">
                  <Link className="nav-link" to="/bejelentkezes">
                    Bejelentkezés
                  </Link>
                </button>
              </li>
              <li className="navbar-item ms-2">
                <button type="button" className="btn btn-outline-primary w-100">
                  <Link className="nav-link" to="/regisztracio">
                    Regisztráció
                  </Link>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
