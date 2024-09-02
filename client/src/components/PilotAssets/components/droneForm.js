"use client"
import React, { useEffect, useState } from 'react';
import { assetData } from '@/atom/states';
import RequiredStar from '@/components/smallComponents/RequiredStar';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import { droneName } from '@/data/dataset';

const DroneForm = ({ isOpen, setIsOpen, handleSubmit, loading, setData, data }) => {

    const [allAsset, setAllAsset] = useRecoilState(assetData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
       
            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        
    };

	


    return (
        <>
            <Modal hideCloseButton isOpen={isOpen} className="flex items-center justify-center">
                <ModalContent className="overflow-y-auto max-h-[90vh]">
                    <ModalHeader className="flex flex-col gap-1">Add Drone</ModalHeader>
                    <ModalBody>
                        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col min-w-full gap-4 text-tiny md:text-sm">
                            <div>
                                <p>Drone Id <RequiredStar /></p>
                                <input
                                    name="droneId"
                                    required
                                    className="p-2 w-full min-w-[300px] rounded bg-gray-100 text-gray-800"
                                    type="text"
                                    placeholder="Drone ID"
                                    value={data.droneId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <p>Owner Name <RequiredStar /></p>
                                <input
                                    name="ownerName"
                                    required
                                    className="p-2 w-full min-w-[300px] rounded bg-gray-100 text-gray-800"
                                    type="text"
                                    placeholder="Owner Name"
                                    value={data.ownerName}
                                    onChange={handleInputChange}
                                />
                            </div>

                                <div>
                                    <p>Drone Name <RequiredStar /></p>
                                    <select
                                        name="name"
                                        required
                                        className="p-2 rounded w-full bg-gray-100 text-gray-800"
                                        value={data.project}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Drone</option>
                                        {droneName?.map((i) =>
                                            <option className='text-gray-800 py-1' key={i} value={i}>{i}</option>
                                        )}
                                    </select>
                                </div>
                           
                        
                            <div className='flex items-center justify-end gap-3 w-full p-4'>
                                <Button color="danger" variant="light" onPress={() => {
                                    setIsOpen(false);
                                    setData({
										name:'',
										droneId:'',
										ownerName:''
                                    });
                                }}>
                                    Close
                                </Button>
                                {loading ? (
                                    <Spinner />

                                ) : (
                                    <Button color="primary" className='cursor-pointer' type="submit">
                                        Save
                                    </Button>
                                )}
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DroneForm;
