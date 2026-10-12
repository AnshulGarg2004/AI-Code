import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { getCurrUser } from './features/get_curr_user';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';
import Project from '../pages/Project';
import Plan from '../pages/Plan';

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
            <Route path='/project/:id' element={<Project/>} />
            <Route path='/plan' element={<Plan/>} />
        </Routes>
        </BrowserRouter>
   
  )
}

export default App
