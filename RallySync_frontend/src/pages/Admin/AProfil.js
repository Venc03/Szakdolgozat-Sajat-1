import React from 'react'
import useAuthContext from '../../contexts/AuthContext';


function AProfil() {
  const { user } = useAuthContext();
  return (
    <div className="container mt-5">
            <h1>Profil</h1>
            <div className="card w-25">
              <div className="card-header d-flex justify-content-center align-items-center">
                <h3>Info:</h3>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  {user.name}
                </li>
                <li className="list-group-item">
                  {user.email}
                </li>
                <li className="list-group-item">
                  {user.permission} lvl
                </li>
              </ul>
            </div>
        </div>
  )
}

export default AProfil