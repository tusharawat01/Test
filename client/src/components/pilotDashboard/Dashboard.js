"use client"

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import WeatherCard from './WeatherCard';
import FlightRecords from './FlightRecords';
import { verifyPilotAuth } from '@/utils/verifyauth';
import {useRouter} from 'next/navigation';

import Cookies from "universal-cookie";
import { useRecoilState } from 'recoil';
import { logData, pilotData, pilotProject } from '@/atom/states';
import { getAllLog } from '@/routes/PilotLog';
import { getAllProj } from '@/routes/PilotProj';
const cookies = new Cookies(null, { path: '/' });

const MapView = dynamic(
  () => import('@/components/pilotDashboard/MapView'),
  {
    loading: () => <div className="w-full p-6 pt-4 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-full bg-gray-300 rounded  mb-4"></div>
    </div>,
    ssr: false
  }
);

const Dashboard = () => {
  const [currentUser,setCurrentUser] =useRecoilState(pilotData)
  const [allLogs,setAllLog] =useRecoilState(logData)
  const [allProj,setAllProj] =useRecoilState(pilotProject)
  const router = useRouter();

  useEffect(() => {
    const token = cookies.get('auth');
    
    if (!token) {
      router.push('/pilot/login');
      return;
    }
  
    verifyPilotAuth({ setCurrentUser, token }).then((data) => {
      
      if (!data) {
        router.push('/pilot/login');
      }
    });
  }, [router, setCurrentUser]);

  useEffect(()=>{
    getAllLog(setAllLog)
  },[currentUser])
  
  useEffect(()=>{
    getAllProj(setAllProj)
  },[currentUser])
  
  return (
    <div>
      <div className='grid lg:grid-cols-2 gap-5 p-2'>
        <WeatherCard />
        <MapView />
      </div>
    
      
      <div className='my-10'>
        <FlightRecords />
      </div>


    </div>
  );
};

export default Dashboard;
