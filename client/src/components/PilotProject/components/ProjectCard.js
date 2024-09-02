"use client"
import React, { useState } from 'react';
import { IoLocation } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoPricetag } from "react-icons/io5";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { TbDeviceRemote } from 'react-icons/tb';
import { GiDeliveryDrone } from "react-icons/gi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { RiChatDeleteFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import DelModal from '../../smallComponents/DelModal'
import dayjs from 'dayjs';

const ProjectCard = ({ project, projId, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('DD/MM/YYYY');
  };

  const openModal = () => {
    console.log("open")
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("close")
    
    setIsModalOpen(false);
  };

  const confirmDelete = (projId) => {
    handleDelete(projId);
    console.log("delete")

    closeModal();
  };

  return (
    <>
      <Card className="py-2 relative ">
      {/* <DelModal isOpen={isModalOpen} handleDelete={confirmDelete} handleClose={closeModal} /> */}
        <CardHeader className="pb-0 pt-2 px-4 flex-col  items-start">

          <div className='flex items-center justify-end w-full mb-1'>
            <TiDelete onClick={()=>handleDelete(projId)} className='text-md cursor-pointer w-fit h-fit inline-block  text-red-600 hover:text-red-700' />
          </div>

          <div className='flex mb-2 items-center  w-full  justify-between rounded-full flex-wrap gap-3'>

            <p className='text-tiny text-blue-500 font-medium'>{project?.tag}</p>
            {/* <p className={`text-tiny font-medium  ${project?.status==='ongoing'?'text-yellow-600':'text-green-500'}`}>{project?.status?.replace(project?.status[0],project?.status[0].toUpperCase())}</p> */}
          </div>
          <p className="text-tiny flex items-center gap-2 text-gray-500 "> <IoLocation></IoLocation>{project?.location}</p>
          <p className="text-tiny flex items-center gap-2 text-gray-500 "> <TbDeviceRemote />{project?.type}</p>
          <p className="text-tiny flex items-center gap-2 text-gray-500 "> <GiDeliveryDrone />
            {project?.rangeCovered}{project?.type.includes('linear') ? 'km' : 'acres'}</p>
          <small className="text-default-500 flex text-tiny  items-center gap-2"><FaClockRotateLeft></FaClockRotateLeft> {formatDate(project?.startDate)} - {formatDate(project?.endDate)}</small>
          <h4 className="font-bold text-large">{project?.title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl "
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGiFj6ux93sw_VbFXSqm98eQa5LmAEwm9SkMYZt6UGGeAs4z2P4hCFzyyhVk953H7Jffw&usqp=CAU"
            width={270}
          />
        </CardBody>
      </Card>
    </>

  );
}

export default ProjectCard;
