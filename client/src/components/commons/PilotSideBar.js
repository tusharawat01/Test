"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { TbDrone } from "react-icons/tb";
import { FaRegFolder } from "react-icons/fa";

import { IoIosArrowDroprightCircle } from "react-icons/io";
import { usePathname, useRouter } from 'next/navigation';
import { PiSignOut } from "react-icons/pi";
import { pilotData, SidebarState } from '@/atom/states';

import { useRecoilState } from 'recoil';

import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' });

const PilotSideBar = () => {
    
    const router= useRouter();
    const [currentUser,setCurrentUser] =useRecoilState(pilotData)
    const [open,setOpen] =useRecoilState(SidebarState)
    const navlist = [
        {
            title: 'Dashboard',
            link: `/pilot/dashboard/${currentUser?.fullName.toLowerCase().replace(" ","-")}`,
            icon: <MdDashboard className='text-xl max-sm:text-sm' />
        },
        {
            title: 'Profile',
            link: `/pilot/profile/${currentUser?.fullName.toLowerCase().replace(" ","-")}`,
            icon: <CgProfile className='text-xl max-sm:text-sm' />
        },
        {
            title: 'Projects',
            link: `/pilot/projects/${currentUser?.fullName.toLowerCase().replace(" ","-")}`,
            icon: <FaRegFolder className='text-xl max-sm:text-sm' />
        },
        {
            title: 'Flight Records',
            link: `/pilot/logs/${currentUser?.fullName.toLowerCase().replace(" ","-")}`,
            icon: <FaChartLine className='text-xl max-sm:text-sm' />
        },
        {
            title: 'Assets',
            link: `/pilot/assets/${currentUser?.fullName.toLowerCase().replace(" ","-")}`,
            icon: <TbDrone className='text-xl max-sm:text-sm' />
        },
        // {
        //     title: 'Settings',
        //     link: `/pilot/settings/${currentUser?.fullName.toLowerCase().replace(" ","-")}`,
        //     icon: <MdOutlineSettings className='text-xl max-sm:text-sm' />
        // },
  
 
     
    ];
    

    const pathname = usePathname();

    return (
        <div className={` ${open ? "w-60" : "w-20 max-sm:w-12 max-md:w-14 "}  bg-stone-700 h-screen relative p-2 lg:p-5 pt-8  duration-300`}>
            <IoIosArrowDroprightCircle
                className={`absolute max-md:hidden z-[1600] text-blue-400  cursor-pointer text-2xl  -right-3 top-9 w-7 
                  rounded-full ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
            />
            <div className="flex gap-x-4 items-center">
                <img
                    src="https://s3.ap-south-1.amazonaws.com/refrens.images/60cc1382083e180012f4abe1/65ae1f9582205200279e2290/ref1705910174489.png"
                    className={`cursor-pointer  w-[80%] object-cover overflow-hidden object-cover duration-500 `}
                />
                
            </div>
            <ul className="pt-6">
                {navlist.map((Menu, index) => (
                    <Link title={Menu.title} href={Menu.link} key={index} className={`flex my-1 rounded-md p-2 cursor-pointer hover:bg-stone-500 text-gray-100 items-center gap-x-4 
                          ${pathname === Menu.link ? "bg-stone-500" : ""}`}>
                        {Menu.icon}
                        <span className={`${!open && "hidden"} origin-left text-md duration-200`}>
                            {Menu.title}
                        </span>
                    </Link>
                ))}
            </ul>

            <div onClick={()=>{
            cookies.remove('auth')
            router.push('/pilot/login')
        }

            } title='Sign out' className=' flex my-1 hover:bg-stone-500 inset-x-0 w-[80%] mx-auto rounded-md p-2 cursor-pointer  text-gray-100 items-center gap-x-4 
                          bottom-10 absolute'>
                <PiSignOut className={`text-xl ${!open && "mx-auto"}`}/>
                <span className={`${!open && "hidden"} origin-left text-md duration-200`}>
                    Sign Out
                </span>

            </div>
        </div>
    );
}

export default PilotSideBar;
