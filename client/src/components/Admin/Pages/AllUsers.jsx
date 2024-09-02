"use client"

import React, { useContext, useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaThList } from "react-icons/fa";
import { IoMdGrid } from "react-icons/io";
import GridView from '../components/GridView';
import MapView from '../components/MapView';
import { DataContext } from '../../../Contexts/Admin';
import { CiSearch } from 'react-icons/ci';
import StatWidget from '../components/StatWidget';
import { TbDrone } from 'react-icons/tb';

const AllUsers = () => {
  const { res, setAllUsers, allUsers, loading, setFilters, filters } = useContext(DataContext);
  const [viewType, setViewType] = useState('grid');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedFilters, allUsers]);

  const handleFilterChange = (value) => {
    setSelectedFilters(value);
    const newFilters = {};
    value.forEach(option => {
      newFilters[option] = true;
    });
    setFilters(newFilters);
  };

  const handleViewChange = (type) => {
    setViewType(type);
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setFilters({
      haveDrones: false,
      notHavingDrones: false,
      haveWorkExp: false,
      haveLicense: false,
    });
  };

  const filterUsers = () => {
    let users = allUsers;

    if (searchQuery) {
      users = users.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // if (filters.haveDrones) {
    //   users = users.filter(user => user.hasDrone);
    // }

    // if (filters.notHavingDrones) {
    //   users = users.filter(user => !user.hasDrone);
    // }

    // if (filters.haveWorkExp) {
    //   users = users.filter(user => user.hasWorkExperience);
    // }

    // if (filters.haveLicense) {
    //   users = users.filter(user => user.hasLicense);
    // }

    setFilteredUsers(users);
  };

  return (
    <div className='md:p-5 py-5 relative'>
      <h1 className='font-bold text-3xl text-center bg-white rounded-full shadow p-4 text-gray-600'>All Pilots</h1>

      <div className='flex items-center justify-center gap-5 max-sm:text-sm lg:gap-8 flex-wrap my-10 md:my-4 md:p-4'>
        <StatWidget title={"Total Pilots"} value={res?.stats.numberOfPilots} icon={<TbDrone size={30} className='text-white' />} />
        <StatWidget title={"Applied"} value={res?.stats?.numberOfAppliedPilots || 0} icon={<TbDrone size={30} className='text-white' />} />
        <StatWidget title={"With Drones"} value={res?.stats?.numberOfUsersWithDrones || 0} icon={<TbDrone size={30} className='text-white' />} />
        <StatWidget title={"Licensed"} value={res?.stats?.totalUsersWithLicense || 0} icon={<TbDrone size={30} className='text-white' />} />
      </div>

      <div className='flex justify-between gap-10 my-10 px-2 md:px-10'>
        <div className='flex items-center max-w-[400px] md:w-80 border pr-5 px-2 bg-white gap-3 rounded-full'>
          <CiSearch size={20} />
          <input 
            type="text" 
            name="query" 
            placeholder='Search by Name' 
            className='outline-none h-8 rounded-full flex-grow' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='flex items-center max-w-[400px] border pr-5 px-3 bg-white gap-3 text-gray-500'>
          <IoMdGrid 
            size={25} 
            className={`hover:text-blue-500 cursor-pointer ${viewType === 'grid' ? 'text-blue-500' : ''}`} 
            onClick={() => handleViewChange('grid')} 
            title='Grid View' 
          />
          <FaMapMarkedAlt 
            size={25} 
            className={`hover:text-blue-500 cursor-pointer ${viewType === 'map' ? 'text-blue-500' : 'text-gray-500'}`} 
            onClick={() => handleViewChange('map')} 
            title='Map View' 
          />
        </div>
      </div>

      <div>
        {viewType === 'grid' ? <GridView users={filteredUsers} /> : <MapView users={filteredUsers} />}
      </div>
    </div>
  );
}

export default AllUsers;
