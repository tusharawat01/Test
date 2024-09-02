"use client"
import React, { useState } from 'react';
import LogTable from '../PilotLogs/components/LogTable';
import { useRecoilState } from 'recoil';
import { logData } from '@/atom/states';
import { toast } from 'react-toastify';
import { getAllLog } from '@/routes/PilotLog';
import Cookies from 'universal-cookie';
import { reqUrl } from '@/utils/constants';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
const cookies = new Cookies(null, { path: '/' });

const FlightRecords = () => {
    const [flightData, setFlightData] = useState('')
    const [allLogs, setAllLogs] = useRecoilState(logData)
    const [loader, setLoader] = useState(false);
    
    const handleDeleteLog = async (id) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                setLoader(true);
                const token = cookies.get('auth');
                await axios.delete(`${reqUrl}/pilot/delete/log/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      withCredentials: true,
                  
                });
                toast.success('Deleted Successfully');
                await getAllLog(setAllLogs);
            } catch (error) {
                console.log(error)
                toast.error('Something went wrong');
            } finally {
                setLoader(false);
            }
        }
    };
    return (
        <div className='bg-white relative mx-2 p-3 shadow rounded-md'>
            <div className='w-[70%] mx-auto text-white text-sm md:text-xl text-center font-medium absolute -top-5 inset-x-0 bg-gradient-to-r from-blue-500 to-blue-900 p-2 rounded '>
                Recent Flight Records
            </div>

           { loader?
           <div className='flex items-center justify-center p-3'>
            <Spinner/>

           </div>
           :
           <div className='mt-5'>

                {
                    allLogs?.length !== 0 || allLogs ? <div>
                        <LogTable handleDeleteLog ={handleDeleteLog} allLogs={[...allLogs]?.reverse()?.slice(0,5)?.reverse()} setAllLogs={setAllLogs} />
                    </div>
                        :
                        <>
                            <img src="https://ik.imagekit.io/d3kzbpbila/thejashari_uflabwVd8" alt="not available" className='mx-auto' />
                            <p className='opacity-70 text-center'>No Data Available</p>
                        </>

                }

            </div>
}

        </div>
    );
}

export default FlightRecords;
