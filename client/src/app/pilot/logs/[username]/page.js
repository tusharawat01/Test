import Header from '@/components/commons/Header';
import PilotSideBar from '@/components/commons/PilotSideBar';
import LogsMain from '@/components/PilotLogs/LogsMain';
import React from 'react';

const PilotLogPage = () => {
    return (
        <div className="flex">
        <PilotSideBar />
        {/* outer wrapper */}
        <div className='flex flex-col flex-1 overflow-y-auto  h-screen'>
          <Header />
  
          {/* Main page container */}
          <div className=" bg-gray-100 h-full p-2 lg:p-7">
            <h1 className="lg:text-2xl font-semibold mb-5 text-lg opacity-70">Flight Records</h1>
            <LogsMain />
          </div>
  
  
        </div>
  
      </div>
    );
}

export default PilotLogPage;
