"use client"

import React, { useState } from 'react';
import { AutoComplete, Input, Spin, message } from 'antd';
import axios from 'axios';
import { requestUrl } from '../../utils/constants';
import { CheckOutlined } from '@ant-design/icons';
import { IoMdLocate } from 'react-icons/io';
import toast from "react-hot-toast";

const AutoCompleteComponent = ({ setDetails,pinValid,setPinValid, details, otpSent }) => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);

    const handlePinChange = async (value) => {
        setDetails((prevDetails) => ({ ...prevDetails, areaPin: value }));
        if (value.length === 6) {
            setLoading(true);
            setOptionsVisible(true);
            try {
                const response = await axios.get(`${requestUrl}/pincode/${value}`);

                if(response.data[0].PostOffice === null){
                    toast.error("Not a Valid Pincode")
                }else{
                    setAreas(response.data[0].PostOffice);
                    setPinValid(true);
                }
                
            } catch (error) {
                
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    city: '',
                    state: '',
                    area: '',
                    coordinates: null,
                }));
                setAreas([]);
                setPinValid(false);
                message.error('Could not fetch areas. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setDetails((prevDetails) => ({
                ...prevDetails,
                city: '',
                state: '',
                area: '',
                locality:'',
                coordinates: null,
            }));
            setAreas([]);
            setPinValid(false);
            setOptionsVisible(false);
        }
    };


    const handleAreaSelect = (value) => {
        const selectedArea = areas.find((area) => area.Name === value);

        if (selectedArea) {
            const { Name, District, State, longitude, latitude, Pincode } = selectedArea;
            console.log("Lat :", parseFloat(latitude));
            console.log("Long :", parseFloat(longitude) );
            
            setDetails((prevDetails) => ({
                ...prevDetails,
                locality: `${Pincode}-${Name}, ${District}, ${State}`,
                area: Name,
                city: District,
                state: State,
                coordinates: { lat: parseFloat(latitude), lon: parseFloat(longitude) },
            }));
        }
        setOptionsVisible(false);
    };

    return (
        <div>
            <AutoComplete
                size="large"
                className="w-full"
                options={areas.map((area) => ({
                    label: `${area.Pincode}-${area.Name}, ${area.District}, ${area.State}`,
                    value: area.Name,
                }))}
                onSelect={handleAreaSelect}
                onSearch={handlePinChange}
                value={details.areaPin}
                maxLength={6}
                disabled={otpSent}
                open={optionsVisible}
                placeholder ="Enter Area PIN Code"
                required
                
                suffixIcon={<IoMdLocate size={20} className='mx-1 text-gray-800' />}

                
                notFoundContent={loading ? <Spin size={15} className='mx-auto text-center my-1 w-full' /> : null}
            >
            
            </AutoComplete>
            {!pinValid && <p className="text-[10px] mx-2 text-red-500">Enter a valid pincode</p>}

            <div className="mt-4">
                <Input
                    size="large"
                    className='my-1'
                    value={details.locality || "No Area Selected"}
                    placeholder="Selected Area"
                    suffix={details.locality && <CheckOutlined style={{ color: "green" }} />}
                    disabled
                />
            </div>
        </div>
    );
};

export default AutoCompleteComponent;
