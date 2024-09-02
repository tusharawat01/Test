import React from 'react';
import Drones from './components/Drones';
import Batteries from './components/Batteries';
import Payloads from './components/Payloads';

const AssetsMain = () => {
    return (
        <div className=''>
            <Drones/>


            <div className='my-5'>
                <Payloads/>
            </div>
            <div className='my-5'>
                <Batteries/>
            </div>
        </div>
    );
}

export default AssetsMain;
