"use client"
import React, { useEffect, useState } from 'react';
import LogModal from './components/LogModal';
import { useRecoilState } from 'recoil';
import { logData, pilotProject } from '@/atom/states';
import { getAllLog } from '@/routes/PilotLog';
import { CgSearch } from 'react-icons/cg';
import { IoAdd } from 'react-icons/io5';
import { getAllProj } from '@/routes/PilotProj';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import { reqUrl } from '@/utils/constants';
import LogTable from './components/LogTable';
import { Spinner } from '@nextui-org/react';
import { verifyPilotAuth } from '@/utils/verifyauth';

const cookies = new Cookies(null, { path: '/' });

const LogsMain = () => {
    const [allLog, setAllLog] = useRecoilState(logData);
  
    const [allProj, setAllProj] = useRecoilState(pilotProject);
    const [isOpen, setIsOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newLogData, setNewLogData] = useState({
        flightName: '',
        project: '',
        location: '',
        flightDate: '',
        duration: {
            hr: 0,
            min: 0,
            sec: 0
        },
        rangeCovered: '',
        flightType: 'linear videography',
    });

    const fetchLogs = async () => {
        getAllLog(setAllLog);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchProjects = async () => {
        await getAllProj(setAllProj);
    };

    useEffect(() => {
        fetchProjects();
    }, []);


    // *************************************
    // handlers
    const handleAddLog = async (e) => {
        e.preventDefault();
        const token = cookies.get('auth');
        if (!token)
            return toast.error('You are unauthorized. Kindly login!');

        try {
            setLoader(true);
            const response = await axios.post(`${reqUrl}/pilot/log/new`, { data: newLogData }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
            });
            toast.success('Log Added');
            setNewLogData({
                flightName: '',
                project: '',
                location: '',
                flightDate: '',
                duration: {
                    hr: 0,
                    min: 0,
                    sec: 0
                },
                rangeCovered: 0,
                flightType: 'linear videography',
            });
            await getAllLog(setAllLog);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Could not project. Try again!');
        } finally {
            setLoader(false);
            setIsOpen(false);
        }
    };

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
                await getAllLog(setAllLog);
            } catch (error) {
                console.log(error)
                toast.error('Something went wrong');
            } finally {
                setLoader(false);
            }
        }
    };


    // *************************************


    const filteredLogs = allLog?.filter(log =>
        log.flightName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        !allLog ? 
        <div className='flex items-center justify-center h-[300px]'>
            <Spinner /> 
        </div>
        :
        <div className="rounded-md shadow relative bg-white p-2 lg:p-4">
            <LogModal isOpen={isOpen} setIsOpen={setIsOpen} loading={loader} setData={setNewLogData}
                data={newLogData} handleSubmit={handleAddLog} />

            <div className="flex items-center px-2 justify-between mt-2">
                <div className='flex items-center'>
                    <CgSearch className='text-gray-500 text-xl' />
                    <input
                        type="text"
                        placeholder="Search by Name"
                        className="flex-1 text-tiny md:text-sm outline-none rounded px-3 w-full md:w-1/2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-tiny hover:bg-blue-700 min-w-fit text-white flex items-center gap-1 px-3 py-1 md:text-sm rounded">
                    <span className='max-sm:hidden'>Add New</span> <IoAdd />
                </button>
            </div>

            <div className='bg-white my-5 p-2 rounded-lg'>
                <LogTable handleDeleteLog={handleDeleteLog} allLogs={filteredLogs} setAllLogs={setAllLog} />
            </div>
        </div>
    );
}

export default LogsMain;
