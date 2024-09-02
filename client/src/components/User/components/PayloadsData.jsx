"use client"

import React, { useContext } from 'react';
import { UserContext } from '../../../Contexts/User';
import { Button, Form } from 'antd';
import SpecialDropDown from './commons/SpeacialDropDown';
import { payloads } from '../../../data/defaultList';
import { PiDotsThreeOutlineFill } from 'react-icons/pi';

const PayloadsData = () => {
    const { user } = useContext(UserContext)

    return (
        <div>
            {/* Drones */}
            <h2 className='my-5 font-bold text-center text-xl'>
                My Payloads
            </h2>

            <>{
            user?.droneDetails?.payloads.length===0 || ! user?.droneDetails ?<p className='text-center  italic text-sm'>No Payloads Added</p>:

           <> 
            {
                user?.droneDetails?.payloads?.map((item,idx) =>
                    <div key={idx}
                        className='flex px-3 items-center max-w-[200px] py-3 justify-between border-2 shadow-lg rounded-xl bg-white '>
                        <p>{item}</p>
                        <Button className='bg-red-500 block text-white text-xs font-bold'>Delete</Button>

                    </div>

                )

            }
            </>
}
            </>

            <h2 className='my-5 font-bold text-center text-xl'>
                My Addons
            </h2>

            <>{
            user?.droneDetails?.addons.length===0 || ! user?.droneDetails ?<p className='text-center  italic text-sm'>No Addons Added</p>:
           <> 
            {
                user?.droneDetails?.addons?.map((item,idx) =>
                    <div key={idx}
                        className='flex px-3 items-center max-w-[200px] py-3 justify-between border-2 shadow-lg rounded-xl bg-white '>
                        <p>{item}</p>
                        <Button className='bg-red-500 block text-white text-xs font-bold'>Delete</Button>

                    </div>

                )

            }

</>
}
            </>
        </div>
    );
}

export default PayloadsData;
