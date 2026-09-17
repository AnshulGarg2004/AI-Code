import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { getCurrUser } from './features/get_curr_user';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';

const App = () => {
const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async ( ) => {
            const data = await getCurrUser();
            dispatch(setUserData(data)); 
        }

        fetchUser();
    }, [])
    return (
        <BrowserRouter>
        <Routes>
            <Route path='/'  element={<Dashboard/>}/>
        </Routes>
        </BrowserRouter>
   
  )
}

export default App
