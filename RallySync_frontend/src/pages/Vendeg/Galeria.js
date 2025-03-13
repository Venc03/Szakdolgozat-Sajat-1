import React from 'react'
import useAuthContext from '../../contexts/AuthContext';

function Galeria() {
  const { user } = useAuthContext(); 
  return (
    <div>
      <h1>GALÉRIA</h1>
    </div>
  )
}

export default Galeria
