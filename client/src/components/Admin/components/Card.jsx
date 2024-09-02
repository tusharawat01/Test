"use client"

import { Button } from 'antd';
import React, { useContext } from 'react';
import { useRecoilState } from 'recoil';
import { userData } from '@/atom/states';
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleInfo, FaLocationDot } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import Link from 'next/link';
import { GoCopilot } from 'react-icons/go';
import { MdEmail, MdPhone } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { SelectedUserContext } from '@/Contexts/SelectedUser';



const Card = ({ item }) => {

    // const { setSelectedUser } = useContext(SelectedUserContext);
    const [state, setState] = useRecoilState(userData);
    const router = useRouter();
    
    const handleClick = () => {
    setState(item);
    router.push(`/admin/user/${item.role}/${item.fullName}/${item._id}`);
    };

    return (

        <div className='md:w-64 relative w-80 text-sm h-[350px] bg-white p-3 shadow rounded-md'>

            {/* Status */}
            <div className='flex items-center px-2 justify-between'>
                <p className='text-white bg-gradient-to-r text-xs px-4 rounded-full  py-1 from-blue-500 to-blue-700'>{item.role}</p>

                <div className='text-xs  flex w-fit items-center gap-2'>
                    <div
                        className={`min-w-2  min-h-2 rounded-full ${item.status === 'pending' ? 'bg-red-500' : item.status === 'review' ? 'bg-yellow-500 animate-ping' : item.status === 'approved' ? 'bg-green-500' : 'hidden'}`}
                    >
                    </div>
                    {
                        item.status === 'pending' ? "Not Applied" : item.status === 'review' ? 'Review Pending' : item.status === 'approved' ? "Approved" : <FaBan className='text-red-500' size={20} />
                    }
                </div>
            </div>
            <hr className='my-2' />
            {/* details */}
            <div className='p-2 font-semibold text-xs r'>
                <div className='w-12 h-12 rounded-full relative overflow-clip bg-blue-500' >
                        <img src={item.avatar || "https://img.freepik.com/premium-vector/avatar-flat-icon-human-white-glyph-blue-background_822686-239.jpg"} alt={item.fullName} className='absolute inset-0' />
                </div>
                <p className='flex items-center font-bold mt-2 gap-2'>
                      {item.fullName}
                </p>
                <p className='flex items-center mt-2 gap-2'>
                    <MdEmail/> {item.email}
                </p>
                <p className='flex items-center mt-2 gap-2'>
                     <MdPhone /> {item.phone.countryCode} {item.phone.number}
                </p>
                <p className='flex items-center mt-2 gap-2'>
                    <FaLocationDot/> {item.locality}
                </p>
                <p className='flex items-center mt-2 gap-2'>
                     City :-  {item.city}
                </p>
                <p className='flex items-center mt-2 gap-2'>
                     State :-  {item.state}
                </p>
              


            </div>
            <div className='flex  w-full inset-x-0 p absolute bottom-2 px-4 py-3  items-center justify-between text-sm'>
            <button
          onClick={handleClick}
          className='bg-blue-500 shadow-md rounded-full font-bold text-white  px-5 py-1 hover:bg-blue-400'
        >
          View
        </button>
            <div className='flex items-center gap-3'>
            <button className=' text-green-500 text-xs font-semibold hover:text-green-600 '>Approve </button>
            <button className=' text-red-500 text-xs font-semibold hover:text-red-600 '>Reject </button>
            </div>
            </div>

        </div>
        // <div className='min-w-[300px] max-w-[350px] p-2 border-2 shadow-lg rounded-xl bg-white '>
        //     <div className='flex items-center justify-between px-2 my-2 '>
        //         {/* 
        //     <FaBan className='text-red-500 ' title='Suspended'  />
        //     <RxCross2 className='text-red-700 ' title='Rejected'/> */}
        //         {
        //             !item?.isApplied ?
        //                 <FaCircleInfo className='text-yellow-500 ' title='Has not Applied and not completed Profile' />
        //                 : <FaCheckCircle className='text-green-500' title='Profile Completed' />
        //         }

        //         <PiDotsThreeOutlineFill size={20} title='Actions' />

        //     </div>

        //     <div className='my-5 justify-center items-center flex flex-col  font-semibold'>
        //         <p className='font-bold text-blue-500 text-xl'>{item.fullName}</p>
        //         <p>{item.email}</p>
        //     </div>
        //     <div className='flex items-center my-5 flex-wrap justify-between px-2  '>
        //         <p> {item.city},{item.state}</p>
        //         <p>{item.phone.countryCode} {item.phone.number}</p>
        //     </div>

        //     <div className='flex gap-2 items-center justify-center'>
        //         <div className='border-2 p-1 w-[70px]  rounded-lg text-center'>
        //             <p>{item.droneDetails?.drones?.length || 0}</p>
        //             <p className='text-xs'>Drones</p>
        //         </div>

        //         <div className='border-2 p-1 w-[70px]   rounded-lg text-center'>
        //             <p>{item?.basicDetails?.yearsOfExp || 0}</p>
        //             <p className='text-xs'>Experience</p>
        //         </div>

        //         <div className='border-2 p-1 w-[70px]  rounded-lg text-center'>
        //             <p>{item?.basicDetails?.serviceRange || 0}</p>
        //             <p className='text-xs'> Range</p>
        //         </div>


        //     </div>

        //     <Link to={`/admin/dashboard/user/${item._id}`} state={item} >
        //         <Button className='bg-blue-500 mx-auto my-5 block text-white  w-[80%] font-bold'>View Profile</Button>
        //     </Link>
        // </div>
    );
}

export default Card;
