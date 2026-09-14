import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvdider } from '../firebase';
import { login } from './features/login';

const App = () => {


    const handleLogin = async () => {
        const data = await signInWithPopup(auth, googleProvdider);
        const token = await data.user.getIdToken();
        const loginData = await login(token);

        console.log("login data : ", loginData);
        
        console.log(data);
        
    }
  return (
    <div>
      <button onClick={handleLogin}>
        Continue with google
      </button>
    </div>
  )
}

export default App
