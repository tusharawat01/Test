"use client"

import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, Dropdown, Menu, Spin } from 'antd';
import { FaBars } from 'react-icons/fa';
import { DataContext } from '../Contexts/Admin';
import { MdOutlineDashboard } from "react-icons/md";
import { TbDrone } from "react-icons/tb";
import { VscServerProcess } from "react-icons/vsc";
import { GoOrganization } from "react-icons/go";
import { FaSignOutAlt, FaRegEdit } from "react-icons/fa";

import avatar from "../assets/avatar.png";
import Image from 'next/image';

const AdminPanel = ({ children }) => {
    const [openNav, setOpenNav] = useState(false);
    const { admin, handleLogout, loading } = useContext(DataContext);
    const router = useRouter();

    const toggleNav = () => {
        setOpenNav(!openNav);
    };

    const isActive = (route) => {
        return router.pathname === route ? 'bg-gradient-to-r from-blue-500 shadow-lg to-blue-700 text-white' : 'shadow hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-700';
    };

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white text-gray-800 border-b">
                <div className="px-3 py-1 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={toggleNav}
                                type="button"
                                className="inline-flex items-center p-2 text-sm rounded-lg sm:hidden hover:text-blue-500"
                            >
                                <FaBars className="w-6 h-6" />
                            </button>
                            <Link href="/" className="flex items-center md:w-48 w-36 lg:ml-5 space-x-3">
                                <img src={'https://res.cloudinary.com/daaeq1zas/image/upload/v1720380090/Logo_Png-12_dmpo2t.png'} className="w-full h-full max-sm:scale-110 mx-1" alt="aero2astro" />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="md:text-sm text-xs">
                                <p className="font-semibold">
                                    {admin?.username}
                                    {admin && <span className="text-xs font-normal text-blue-500"> Admin</span>
                                    }
                                </p>
                                <p>{admin?.email}</p>
                            </div>
                            {!admin?.email && (
                                <Link href="/admin/login" className="bg-blue-500 p-2 px-4 text-white mx-2 text-sm">
                                    Login
                                </Link>
                            )}
                            <div className="flex relative items-center ml-3">
                                <Image src={admin?.avatar || avatar} alt={admin?.username} className="w-10 h-10 md:w-12 my-1 md:h-12 rounded-full" />
                                <FaRegEdit className='text-blue-500 absolute bottom-0 right-0 bg-white rounded-full cursor-pointer hover:text-yellow-400 ' title='Edit Image' />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div onClick={toggleNav}
                className={`fixed top-16 left-0 z-10 w-64 h-full bg-white shadow-md transition-transform transform ${openNav ? 'translate-x-0' : '-translate-x-full'
                    } sm:translate-x-0`}
            >

                <div className='relative h-[90%] w-full'>
                    <div className="p-5 text-gray-900">
                        <Link href="/admin/dashboard">
                            <div className={`${isActive('/admin/dashboard')} flex p-2 gap-3 mt-5 items-center rounded`}>
                                <MdOutlineDashboard size={33} className="shadow-md rounded p-1 bg-white text-blue-500" />
                                <p>Dashboard</p>
                            </div>
                        </Link>

                        <Link href="/admin/pilots/all">
                            <div className={`${isActive('/admin/pilots/all')} flex p-2 gap-3 mt-5 items-center rounded`}>
                                <TbDrone size={30} className="shadow-md rounded p-1 bg-white text-blue-500" />
                                <p>Pilots</p>
                            </div>
                        </Link>

                        <Link href="/admin/processing/all">
                            <div className={`${isActive('/admin/processing/all')} flex p-2 gap-3 mt-5 items-center opacity-50 cursor-not-allowed rounded`}
                                onClick={(e) => e.preventDefault()}>
                                <VscServerProcess size={30} className="shadow-md rounded p-1 bg-white text-blue-500" />
                                <p>Processing</p>
                            </div>
                        </Link>

                        <Link href="/admin/dgps/all">
                            <div className={`${isActive('/admin/dgps/all')} flex p-2 gap-3 mt-5 items-center opacity-50 cursor-not-allowed rounded`}
                                onClick={(e) => e.preventDefault()}>
                                <GoOrganization size={30} className="shadow-md rounded p-1 bg-white text-blue-500" />
                                <p>DGPS</p>
                            </div>
                        </Link>

                        <div
                            className='bg-gradient-to-r mt-36 inset-x-5 absolute bottom-0 transition-all duration-500 ease-out from-blue-500 shadow-lg to-blue-400 flex p-2 gap-3  items-center  text-white hover:border-blue-500 border hover:from-white hover:text-gray-900 cursor-pointer rounded'
                            onClick={() => handleLogout()}
                        >
                            <FaSignOutAlt size={30} className=" rotate-180 rounded p-1 bg-white text-blue-500" />
                            <p>Sign Out</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 sm:ml-64 min-h-screen">
                {loading ? <Spin className='absolute inset-0 text-6xl bg-white z-50 pt-20' />
                    : <div className="mt-16 p-4">{children}</div>}
            </div>
        </>
    );
};

export default AdminPanel;
