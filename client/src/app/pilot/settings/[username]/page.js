import Header from '@/components/commons/Header';
import PilotSideBar from '@/components/commons/PilotSideBar';
import React from 'react';

const Page = () => {
    return (
        <div className="flex">
        <PilotSideBar />
        {/* outer wrapper */}
        <div className='flex flex-col flex-1 overflow-y-auto  h-screen'>
          <Header />
  
          {/* Main page container */}
          <div className=" bg-gray-100 h-full p-7">
            <h1 className="text-2xl font-semibold mb-5  opacity-70">Settings</h1>
          </div>
  
  
        </div>
  
      </div>
    );
}

export default Page;
