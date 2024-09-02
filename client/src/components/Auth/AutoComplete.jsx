"use client"

import React, { useState } from 'react';
import { AutoComplete, Input, Spin, message } from 'antd';
import axios from 'axios';
import { requestUrl } from '../../utils/constants';
import { CheckOutlined } from '@ant-design/icons';
import { IoMdLocate } from 'react-icons/io';

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
                
                setAreas(response.data);
                setPinValid(true);
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
        const selectedArea = areas.find((area) => area.office_name === value);
        if (selectedArea) {
            const { office_name, district_name, state_name, longitude, latitude, pincode } = selectedArea;
            setDetails((prevDetails) => ({
                ...prevDetails,
                locality: `${pincode}-${office_name}, ${district_name}, ${state_name}`,
                area: office_name,
                city: district_name,
                state: state_name,
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
                    label: `${area.pincode}-${area.office_name}, ${area.district_name}, ${area.state_name}`,
                    value: area.office_name,
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
