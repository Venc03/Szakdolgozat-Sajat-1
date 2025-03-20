import React from 'react'
import useAuthContext from '../contexts/AuthContext';

function Kapcsolat() {
  const { user } = useAuthContext(); 
  return (
    <div>
      <h1>KAPCSOLAT</h1>
    </div>
  )
}

export default Kapcsolat
