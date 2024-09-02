"use client"

import React, { useState } from 'react';
import { droneNames, droneTypes } from '../../../data/defaultList';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import SpecialDropDown from './commons/SpeacialDropDown';
import { Option } from "antd/es/mentions";
import { InfoCircleOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import { LoaderIcon } from 'react-hot-toast';

const DroneForm = ({ handleDroneSubmit,form ,loading,setLoading}) => {
  const [isNotApplicable, setIsNotApplicable] = useState(false);


  const disabledFutureDates = (current) => {
    return current && current.year() > 2024;
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsNotApplicable(checked);
    if (checked) {
        form.setFieldsValue({ uin: 'N/A' });
    } else {
        form.setFieldsValue({ uin: '' });
    }
}
  return (
    <div className="my-8 shadow-md relative rounded-lg border-2 border-blue-500 px-4">
      <p className="bg-gradient-to-r absolute left-0 from-blue-400 to-blue-500 text-white w-fit px-10 rounded-br-xl">
        Drone Detail
      </p>
      <div className='flex gap-4 my-7 flex-wrap items-center'>
        {/* Drone Name */}
        <Form.Item
          className='m-0 max-w-[250px]'
          name="droneModel"
          label="Drone Model"
          
          tooltip={{
            title: `If your drone model is not in the list or you have DGCA certified drones you can add them using add other option`,
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            {
              required: true,
              message: 'Please select drone model',
            },
          ]}
        >
          <SpecialDropDown
           
            mappingData={droneNames}
            placeholder="Select Drone Model"
          />
        </Form.Item>


        {/* Year of purchase */}
        <Form.Item
          className='m-0 '

          name="purchasedOn"
          label="Year of Purchase"

          rules={[
            {
              required: true,
              message: 'Please Type the Year or Select from Calender',
            },
          ]}
        >
          <DatePicker picker='year'
          placeholder='Simply Type the Year or Select'
          className='w-[250px]'
           disabledDate={disabledFutureDates} />
        </Form.Item>

        {/* serial number */}
        <Form.Item
          className='m-0'

          name="serial"
          label="Drone Serial Number"
          rules={[
            {
              required: true,
              message: 'Please enter valid serial number',
            },
          ]}
        >
          <Input
          className='w-[250px]'
           placeholder='Drone Serial Number' />
        </Form.Item>

        {/* uin number */}
        <Form.Item
          className='m-0 w-[250px]'

          tooltip={{
            title: `Fill the Unique Identification Number (UIN) of your drone.`,
            icon: <InfoCircleOutlined />,
          }}
         
          label={(
            <div className='flex  items-center gap-16 justify-between'>
              <p> UIN Number </p>   <Checkbox onChange={handleCheckboxChange}
                checked={isNotApplicable}>N/A</Checkbox>
            </div>
          )}
          name="uin"
          
          rules={[
            {
              required: !isNotApplicable,
              message: 'Please enter valid uin number',
            },
          ]}
        >
          <Input 
          disabled ={isNotApplicable}
          placeholder='UIN Number' />
        </Form.Item>

        {/* Drone Type */}
        <Form.Item
          className='m-0 w-[250px]'

          name="droneType"
          label="Drone Type"

          rules={[
            {
              required: true,
              message: 'Please select the drone type',
            },
          ]}
        >
          <Select 
         
          placeholder="Select Drone Type">
            {droneTypes?.map((val, idx) => (
              <Option key={idx} value={val}>{val}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* battery */}
        <Form.Item
          className='m-0'
          name="batteries"
          label="No. of Drone Batteries you have"
          rules={[
            {
              required: true,
              message: 'Enter number',
            },
          ]}
        >
          <InputNumber
            className="min-w-[250px] "
            min={0}
            placeholder='No. of Good Drone Batteries Have'
          />
        </Form.Item>
        
        <Button
          onClick={handleDroneSubmit}
          disabled ={loading}
          className='min-w-[150px] relative top-[14px]  text-white font-bold hover:bg-white hover:border-blue-500 hover:text-500 bg-blue-500'
        >
        { loading ? "Saving....": "Save Drone Details"}
        </Button>
      </div>

    </div>
  );
}

export default DroneForm;
