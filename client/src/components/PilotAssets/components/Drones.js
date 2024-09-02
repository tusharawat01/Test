"use client"
import React, { useEffect, useState } from 'react';
import { CgSearch } from 'react-icons/cg';
import { IoAdd } from 'react-icons/io5';
import { TbDrone } from 'react-icons/tb';
import DroneForm from './droneForm';
import DroneCard from './DroneCard';
import { getAllAssets } from '@/routes/PilotAssets';
import { useRecoilState } from 'recoil';
import { assetData } from '@/atom/states';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { reqUrl } from '@/utils/constants';
import { Spinner } from '@nextui-org/react';
const cookies = new Cookies(null, { path: '/' });

const Drones = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [allAssets, setAllAsset] = useRecoilState(assetData);
    const [newDroneData, setNewDroneData] = useState({
        name: '',
        droneId: '',
        ownerName: ''
    });

    useEffect(() => {
        getAllAssets(setAllAsset);
    }, []);

    const handleAddDrone = async (e) => {
        e.preventDefault();
        const token = cookies.get('auth');
        if (!token)
            return toast.error('You are unauthorized. Kindly login!');

        try {
            setLoader(true);
            const response = await axios.post(`${reqUrl}/pilot/assets/drone/new`, { data: newDroneData }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
            });
            toast.success('Drone Added');
            setNewDroneData({
                name: '',
                droneId: '',
                ownerName: ''
            });
            await getAllAssets(setAllAsset);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Could not Add. Try again!');
        } finally {
            setLoader(false);
            setIsOpen(false);
        }
    };

    // Filter drones based on the search term
    const filteredDrones = allAssets?.drones?.filter(drone =>
        drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.droneId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-2 bg-white shadow rounded-md'>
            <h2 className="text-lg flex items-center gap-2 border-b font-bold px-5 rounded-sm inset-x-0 py-1 text-gray-800">
                Drones
            </h2>
            <div className='text-sm flex items-center gap-3 font-medium p-2 px-3 mb-2'>
                <button className='text-white bg-blue-600 py-1 px-2 rounded-md shadow flex items-center gap-2'><TbDrone /> Own</button>
            </div>
            <div className='flex px-1 md:px-4 items-center md:text-sm text-tiny justify-between gap-3'>
                <div className='flex items-center'>
                    <CgSearch className='text-gray-500 text-xl' />
                    <input
                        type="text"
                        placeholder="Search Drone"
                        className="flex-1 text-tiny md:text-sm outline-none rounded px-2 w-[70%]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-tiny hover:bg-blue-700 min-w-fit text-white flex items-center gap-1 px-3 py-1 md:text-sm rounded">
                    <span className='max-sm:hidden'>Add Drone</span> <IoAdd />
                </button>
            </div>

            <DroneForm handleSubmit={handleAddDrone} data={newDroneData} setData={setNewDroneData} isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className='my-5 md:px-5 py-2 p-1 flex items-center gap-4 flex-wrap'>
                {
                    loader ||!allAssets ? (
                        <div className='flex items-center w-full justify-center'>
                            <Spinner />
                        </div>
                    ) : (
                        filteredDrones?.length === 0 ? (
                            <div className='text-center text-xs w-full'>No Drone Available</div>
                        ) : (
                            filteredDrones?.map((drone) =>
                                <DroneCard drone={drone} key={drone._id} />
                            )
                        )
                    )
                }
            </div>
        </div>
    );
};

export default Drones;
