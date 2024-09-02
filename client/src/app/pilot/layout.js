"use client"
import { logData, pilotData, pilotProject } from '@/atom/states';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' });
import { verifyPilotAuth } from '@/utils/verifyauth';
import { getAllProj } from '@/routes/PilotProj';
import { getAllLog } from '@/routes/PilotLog';
const PilotLayout = ({ children }) => {
    const [currentUser, setCurrentUser] = useRecoilState(pilotData)
    const [proj, setProj] = useRecoilState(pilotProject)
    const [logs, setLogs] = useRecoilState(logData)
    const router = useRouter();

    // session verify
    useEffect(() => {
        const token = cookies.get('auth')
        if (!token)
            router.push('/pilot/login')
        const data = verifyPilotAuth({ setCurrentUser, token });
        if (!data || data === 'error')
            router.push('/pilot/login');


    }, []);




    return (
        <>
            {children}
        </>
    );
}

export default PilotLayout;
