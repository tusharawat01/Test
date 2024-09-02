"use client"

import React, { useEffect } from 'react';
import ProfileInfo from './profileInfo';
import Skills from './Skills';
import Cookies from 'universal-cookie';
import { verifyPilotAuth } from '@/utils/verifyauth';
import { useRecoilState } from 'recoil';
import { logData, PageLoader, pilotData } from '@/atom/states';
import Softwares from './Softwares';
import { Spinner } from '@nextui-org/react';
import Drones from './Drones';
import CircularProgress from './components/cir';
import { getAllLog } from '@/routes/PilotLog';
const cookies = new Cookies(null, { path: '/' });

const Profile = () => {
  const [currentUser, setCurrentUser] = useRecoilState(pilotData)
  const [pageLoader, setPageLoader] = useRecoilState(PageLoader)
  const [allLogs, setAllLogs] = useRecoilState(logData)

  useEffect(() => {
    getAllLog(setAllLogs)
  }
    , [])


  return (
    <div className='pb-4'>{
      !currentUser ?
        <div className='flex items-center justify-center h-full bg-white '>
          <Spinner color={'primary'} size='large' />
        </div> :
        <>
          <div className='mb-4'>
            <ProfileInfo />
          </div>

          <div className='mb-4'>
            <Skills />
          </div>

          <div className='mb-4'>
            <Softwares />
          </div>

          <div className='mb-4'>

            <Drones />
          </div>
        </>

    }

    </div>
  );
}

export default Profile;
