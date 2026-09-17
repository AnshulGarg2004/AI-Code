import React, { useState } from 'react'
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvdider } from "../firebase"

import { FcGoogle } from "react-icons/fc";
import { login } from '../src/features/login';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../src/redux/userSlice';

const Dashboard = () => {

    const [loading,  setLoading] = useState(false);

    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user);

    const handleLogin = async () => {
        setLoading(true);
        const data = await signInWithPopup(auth, googleProvdider );
        const token = await data.user.getIdToken();
        const loginData = await login(token);
        setLoading(false);

        dispatch(setUserData(loginData))

    }


    if(!userData) {
         return (
        <div className=' relative flex h-screen w-full  items-center justify-center overflow-hidden bg-slate-50 px-4 transition-colors duration-300 dark:bg-[#07070c]'>
            <div className=' pointer-events-none absolute -top-32 left-1/2 hidden h-[600px] w-[600px]  -translate-x-1/2 rounded-full blur-[120px] dark:block bg-white/[0.05]' />

            <div className='relative w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-black/40'>
                <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/5 dark:border-transparent'>
                    <span className='text-lg font-bold text-slate-900'>AI</span>
                </div>
                <h2 className='mb-2 text-xl font-bold text-slate-900 dark:text-white'>Welcome to AI+ Code</h2>
                <p className='mb-6 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400'>Sign in to access your projects and continue building.</p>


                <button disabled={loading} onClick={handleLogin  } className='flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-2.5 text-[13.5px] font-medium text-slate-800 shadow-sm transition-colors duration-150 hover:bg-slate-50 disabled:opacity-70 dark:border-transparent dark:bg-white dark:hover:bg-slate-100'>
                    <FcGoogle /> {loading ? "Signing in..." : "Continue with Google"}
                </button>

                <p className='mt-5 text-[11px] text-slate-400 dark:text-slate-600'>By continuing you agree to our Terms &amp; Privacy Policy.</p>
            </div>



        </div>
    )
    }


    return (
        <div>fl me</div>
    )

   
}

export default Dashboard
