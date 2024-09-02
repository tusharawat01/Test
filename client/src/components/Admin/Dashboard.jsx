"use client"

import React, { useContext, useState } from 'react';
import { DataContext } from '../../Contexts/Admin';
import Widgets from './components/Widgets';
import { Grid, Progress } from 'antd';
import GridView from './components/GridView';
import { useRecoilState } from 'recoil';
import { userData } from '@/atom/states';
import { CiSearch } from "react-icons/ci";
import { FaUserAltSlash } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaRegHandshake } from "react-icons/fa";
import { BsBan } from "react-icons/bs";


import ListView from './components/ListView';
import Card from './components/Card';
import StatWidget from './components/StatWidget';
import { TbDrone } from "react-icons/tb";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SelectedUserContext } from '@/Contexts/SelectedUser';
const Dashboard = () => {

    // const { setSelectedUser } = useContext(SelectedUserContext);
    const [state, setState] = useRecoilState(userData);
    const router = useRouter();
    
    const handleClick = (user) => {
        setState(user);
        router.push(`/admin/user/${user.role}/${user.fullName}/${user._id}`);
    };


    const { res, allNewUsers } = useContext(DataContext)

    return (
        <div>

            {/* Search box */}
            <div className='flex items-center shadow md:mx-10 bg-white my-4 rounded-full px-5 py-2 gap-2'>
                <CiSearch size={20} /> <input type="text" name="query" id="" placeholder='Search by Email, Name, phone' className='outline-none h-8 rounded-full flex-grow' />
            </div>

            <div className='flex items-center justify-center gap-5 md:gap-4 flex-wrap my-10 md:my-4 md:p-2'>
                <StatWidget title={"Total Applications"}
                    value={res?.totalCount}
                    icon={<FaUsers size={30} className='text-white' />}
                />
                <StatWidget title={"Total Applied"}
                    value={res?.stats?.numberOfAppliedUsers}
                    icon={<IoStatsChartSharp size={30} className='text-white' />}
                />
                <StatWidget title={"Total Approved "}
                    value={0}
                    icon={<FaRegHandshake size={30} className='text-white' />}
                />
                <StatWidget title={"Total Rejected"}
                    value={0}
                    icon={<BsBan size={30} className='text-white' />}
                />

            </div>


            <div className='rounded-lg mt-20 md:p-4 relative md:mx-12 my-10 p-2 bg-white shadow '>
                <div className='bg-gradient-to-r w-[90%] shadow-lg  absolute -top-5 inset-x-0 mx-auto  p-4 text-white rounded-md from-blue-500 to-blue-700'>
                    <h2 className='font-semibold text-center text-xl'>Today&apos;s Applications</h2>
                </div>

                {/*  user Table */}

                <div className='flex mt-10 py-2 md:px-7 justify-between text-xs items-center '>
                    <div className='flex items-center max-w-[400px] border pr-5 px-3 gap-3 rounded-full'>

                        <CiSearch size={20} /> <input type="text" name="query" id="" placeholder='Search by Name' className='outline-none h-8 rounded-full flex-grow' />
                    </div>
                    <div className='flex items-center flex-wrap justify-end'>
                        <button className='border  bg-gradient-to-r from-blue-400 to-blue-600 text-white
  hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white  px-2 py-1 '>
                            Today
                        </button>
                        <button className='border hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white px-2 py-1 '>
                            Yesterday
                        </button>
                        <button className='border hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white px-2 py-1 '>
                            Last Week
                        </button>

                    </div>
                </div>

                <div className="mb-10 my-4 overflow-scroll md:mx-4" style={{ scrollbarWidth: "none" }}>
                    <div className="grid grid-cols-7 text-sm">
                        {["Name", "Role", "Email", "Phone", "City", "State", "Applied"].map((header) =>
                            <div key={header} className="font-bold border-b border-gray-300 p-2">
                                {header}
                            </div>
                        )}
                    </div>
                    {allNewUsers.length === 0 ? (
                        <div className="opacity-50 col-span-7 text-center my-5">
                            <FaUserAltSlash size={40} className="w-fit mx-auto" />
                            No Application Received 
                        </div>
                    ) : (
                        allNewUsers?.map((user) => (
                            <div key={user._id} onClick={() => handleClick(user)} className="grid grid-cols-7 text-sm cursor-pointer hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-400" title='View Profile'>
                            <div className="border-b border-gray-200 p-2">{user.fullName}</div>
                            <div className="border-b border-gray-200 p-2">{user.role}</div>
                            <div className="border-b border-gray-200 p-2 overflow-x-scroll" style={{ scrollbarWidth: "none" }}>{user.email}</div>
                            <div className="border-b border-gray-200 p-2 px-3">{user.phone.number}</div>
                            <div className="border-b border-gray-200 p-2">{user.city}</div>
                            <div className="border-b border-gray-200 p-2">{user.state}</div>
                            <div className="border-b border-gray-200 p-2">{user.isApplied ? 'Applied' : 'Not Applied'}</div>
                        </div>
                        ))
                    )}
                </div>




            </div>



            {/* Applications for Approval */}
            <div className='rounded-lg mt-20 md:p-4 relative md:mx-12 my-10 p-2 bg-white shadow '>
                    <div className='w-4 h-4 bg-green-500 absolute -top-1 -left-1 rounded-full animate-pulse'></div>
                <div className='bg-gradient-to-r w-[90%] shadow-lg  absolute -top-5 inset-x-0 mx-auto  p-4 text-white rounded-md from-blue-500 to-blue-700'>
                    <h2 className='font-semibold text-center text-xl'>Applications for Approval</h2>
                </div>

                {/*  user Table */}

                <div className='flex mt-10 py-2 md:px-7 justify-between text-xs items-center '>
                    <div className='flex items-center max-w-[400px] border pr-5 px-3 gap-3 rounded-full'>

                        <CiSearch size={20} /> <input type="text" name="query" id="" placeholder='Search by Name' className='outline-none h-8 rounded-full flex-grow' />
                    </div>
                    <div>
                    <button className='border bg-gradient-to-r from-blue-400 to-blue-600 text-white
  hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white  px-2 py-1 '>
                            All
                        </button>
                        <button className='border hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white px-2 py-1 '>
                            Today
                        </button>
                      
                
                    </div>
                </div>

                <div className="mb-10 my-4 overflow-scroll md:mx-4" style={{ scrollbarWidth: "none" }}>
                    <div className="grid grid-cols-7 text-sm">
                        {["Name", "Role", "Email", "Phone", "City", "State", "Action"].map((header) =>
                            <div key={header} className="font-bold border-b border-gray-300 p-2">
                                {header}
                            </div>
                        )}
                    </div>
                    {allNewUsers.length === 0 ? (
                        <div className="opacity-50 col-span-7 text-center my-5">
                            <FaUserAltSlash size={40} className="w-fit mx-auto" />
                            No Application Received
                        </div>
                    ) : (
                        allNewUsers?.map((user) => (
                            <div key={user._id} onClick={() => handleClick(user)} className="grid grid-cols-7  text-sm cursor-pointer hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-400 " title='View Profile'>
                                <div className="border-b border-gray-200 p-2  ">{user.fullName}</div>
                                <div className="border-b border-gray-200 p-2">{user.role}</div>
                                <div className="border-b border-gray-200 p-2 overflow-x-scroll" style={{ scrollbarWidth: "none" }}>{user.email}</div>
                                <div className="border-b border-gray-200 p-2 px-3">{user.phone.number}</div>
                                <div className="border-b border-gray-200 p-2">{user.city}</div>
                                <div className="border-b border-gray-200 p-2">{user.state}</div>
                                <div className="border-b border-gray-200 flex gap-3 items-center p-2">
                                    <p className='text-green-500'>Approve</p>
                                    <p className='text-red-500'>Reject</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>




            </div>






            {/* <div className='flex gap-5 p-5 flex-wrap justify-between items-center my-4'>

            

                <div className='min-w-[280px] max-w-[525px] flex-grow px-5 py-4 max-h-[400px] overflow-clip bg-white border-2 rounded-lg'>
                    <div className='p-1'>
                        <p className='text-2xl'>{res?.stats?.totalUsersWithLicense || 0}</p>
                        <p className='text-xs'>Pilots with License</p>
                        <Progress percent={res?.totalCount && ((res?.stats?.totalUsersWithLicense / res?.totalCount) * 100).toPrecision(2)} size={"small"} />
                    </div>

                    <div className='p-1'>
                        <p className='text-2xl'>{res?.stats?.numberOfUsersWithWorkExp || 0}</p>
                        <p className='text-xs'>Pilots with Work Experience</p>
                        <Progress percent={res?.totalCount && ((res?.stats?.numberOfUsersWithWorkExp / res?.totalCount) * 100).toPrecision(2)} size={"small"} />
                    </div>

                    <div className='p-1'>
                        <p className='text-2xl'>{res?.stats?.numberOfUsersWithDrones || 0}</p>
                        <p className='text-xs'>Pilots with Drones</p>
                        <Progress percent={res?.totalCount && ((res?.stats?.numberOfUsersWithDrones / res?.totalCount) * 100).toPrecision(2)} size={"small"} />
                    </div>
                    <div className='p-1'>
                        <p className='text-2xl'>{(res?.totalCount - res?.stats?.numberOfUsersWithDrones) || 0}</p>
                        <p className='text-xs'>Pilots with No Drones</p>
                        <Progress percent={res?.totalCount && (((res?.totalCount - res?.stats?.numberOfUsersWithDrones) / res?.totalCount) * 100).toFixed(2)} size={"small"} />
                    </div>


                </div>




            </div> */}



<div className='md:mx-10 text-center'>
 &copy; Aero2Astro | Made with <span className='text-red-500'>&hearts;</span> by Ankit Gupta
</div>

        </div>
    );
}

export default Dashboard;
