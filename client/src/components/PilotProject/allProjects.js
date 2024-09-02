"use client"

import { pilotData, pilotProject } from '@/atom/states';
import React, { useState, useEffect } from 'react';
import { FaRegFolder } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import ProjectCard from './components/ProjectCard';
import { IoAdd } from 'react-icons/io5';
import { CgSearch } from 'react-icons/cg';
import ProjModal from './components/ProjModal';
import { reqUrl } from '@/utils/constants';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { getAllProj } from '@/routes/PilotProj';
import { Spinner } from '@nextui-org/react';
const cookies = new Cookies(null, { path: '/' });

const AllProjects = () => {

    const [newProjData, setNewProjData] = useState({
        startDate: '',
        endDate: '',
        location: '',
        title: '',
        tag: '',
        rangeCovered: '',
        // status: "",
        type: 'linear videography',
    });
    const [pilotProj, setPilotProj] = useRecoilState(pilotProject);
    const [user, setUser] = useRecoilState(pilotData);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All'); // tab state
    const [isOpen, setIsOpen] = useState(false); // modal state
    const [loader, setLoader] = useState(false);

    const categories = pilotProj?.length > 0 ? ['All', ...new Set(pilotProj?.map(project => project.tag))] : [];

    const filteredProjects = pilotProj?.filter(project =>
        (activeTab === 'All' || project.tag === activeTab) &&
        project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchProjects = async () => {
        const token = cookies.get('auth');
        if (token) {
            await getAllProj(setPilotProj, token);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);


    const handleAddProject = async () => {
        const token = cookies.get('auth');
        if (!token)
            return toast.error('You are unauthorized. Kindly login!');

        try {
            setLoader(true);
            const response = await axios.post(`${reqUrl}/pilot/project/new`, { data: newProjData }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
            });
            toast.success('Project Added');
            setNewProjData({
                startDate: '',
                endDate: '',
                location: '',
                title: '',
                tag: '',
                // status: "",
                rangeCovered: '',
                type: 'linear videography',
            });
            getAllProj(setPilotProj);
        } catch (error) {
            toast.error(error?.response?.data?.message ||'Could not add project. Try again!');
        } finally {
            setLoader(false);
            setIsOpen(false);
        }
    };

    // controllers
    const handleDeleteProject = async (projId) => {
        if (!confirm("Are You Sure to Delete this item ?"))
            return;
        const token = cookies.get('auth');

        if (!token)
            return toast.error('You are unauthorized. Kindly login!');

        try {
            setLoader(true);
            const response = await axios.delete(`${reqUrl}/pilot/project/delete/${projId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
            });
            toast.success('Project Deleted');

            getAllProj(setPilotProj, token);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Could not delete project. Try again!');
        } finally {
            setLoader(false);

        }
    };

    
    return (
        <>
            {!user ? <div className='flex items-center justify-center h-[300px] w-full'>
                <Spinner className='w-fit' />
            </div>


                : 
                
                <div className="rounded-md shadow relative bg-white p-4">
                    <ProjModal isOpen={isOpen} setIsOpen={setIsOpen} loading={loader} setData={setNewProjData} data={newProjData} handleSubmit={handleAddProject} />

                    {/* <h2 className="text-lg flex items-center gap-2 justify-between border-b font-bold px-5 rounded-sm inset-x-0 py-1 text-gray-800">
                    <div className="flex items-center gap-2">
                        <FaRegFolder /> Projects
                    </div>
                </h2> */}

                    <div className="flex items-center px-2 justify-between mt-2">
                        <div className='flex items-center'>
                            <CgSearch className='text-gray-500 text-xl' />
                            <input
                                type="text"
                                placeholder="Search projects"
                                className="flex-1 text-tiny md:text-sm outline-none rounded px-3 w-full md:w-1/2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-tiny hover:bg-blue-700 min-w-fit text-white flex items-center gap-1 px-3 py-1 md:text-sm rounded">
                            <span className='max-sm:hidden'>Add New</span> <IoAdd />
                        </button>
                    </div>

                    {/* Project tabs */}
                    <div className="flex items-center gap-3 text-sm my-4 flex-wrap border-b p-2 md:p-4">
                        {categories?.map((tab) => (
                            <div
                                key={tab}
                                className={`cursor-pointer px-3 max-sm:text-tiny font-medium text-center py-1 rounded ${activeTab === tab ? 'bg-green-600 text-white' : 'hover:bg-green-600 hover:text-white'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    {
                        loader ? <Spinner /> :
                            <div className="flex items-center gap-5 flex-wrap md:justify-start justify-center">
                                {filteredProjects?.length === 0 || !pilotProj ? (
                                    <div className="text-sm text-center text-gray-900">No Projects Found</div>
                                ) : (
                                    filteredProjects?.map((project) => (
                                        <ProjectCard handleDelete={handleDeleteProject} projId={project._id} key={project._id} project={project} />
                                    ))
                                )}
                            </div>}
                </div>
            }
        </>

    );
}

export default AllProjects;
