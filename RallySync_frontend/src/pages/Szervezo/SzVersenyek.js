import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext';

function SzVersenyek() {
  const { user } = useContext(AuthContext); 
  return (
    <div>
      <h1>Elmúlt versenyeim</h1>
    </div>
  )
}

export default SzVersenyek
