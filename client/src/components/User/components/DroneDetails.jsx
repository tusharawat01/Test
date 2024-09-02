"use client"

import { Button, Checkbox, Form, Switch } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

import { UserContext } from "../../../Contexts/User";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { requestUrl } from "../../../utils/constants";
import DroneForm from "./DroneForm";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { addonsList, payloadsList } from "../../../data/defaultList";
import HybridSelect from "./commons/HybridSelect";
import DroneData from "./DroneData";
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' ,sameSite:'lax'});


const DroneDetails = () => {
  const { user, fetchUserDetails } = useContext(UserContext);
  const [form] = Form.useForm();
  const [fieldsForm] = Form.useForm(); 
  const [hideDroneForm, setHideDroneForm] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(switchChecked);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(true);
  const [isPayloadNotApplicable, setIsPayloadNotApplicable] = useState(false);
  const [isAddonNotApplicable, setIsAddonNotApplicable] = useState(false);


  useEffect(() => {
    if (user?.droneDetails?.drones.length > 0 || user?.droneDetails?.addons[0]!==("N/A" && undefined ) || user?.droneDetails?.payloads[0]!==('N/A' && undefined ) ) {
      setIsDisabled(false);
      setSwitchChecked(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.droneDetails?.payloads[0] === 'N/A') {
      setIsPayloadNotApplicable(true);
      fieldsForm.setFieldsValue({ payloads: ['N/A'] });
    } else if (user?.droneDetails?.payloads) {
      fieldsForm.setFieldsValue({ payloads: user.droneDetails.payloads || [] });
    }
    if (user?.droneDetails?.addons[0] === 'N/A') {
      setIsAddonNotApplicable(true);
      fieldsForm.setFieldsValue({ addons: ['N/A'] });
    } else if (user?.droneDetails?.addons) {
      fieldsForm.setFieldsValue({ addons: user.droneDetails.addons || [] });
    }
  }, [user, fieldsForm]);

  const handleEditToggle = () => {
    setDisabled(!disabled);
    setEditing(!editing);
  };

  const handleDroneSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        purchasedOn: dayjs(values.purchasedOn).year(),
      };
      const userAuth = cookies.get('auth');
      await axios.post(`${requestUrl}/user/details/drone`, { drones: formattedValues }, {
        headers:{
         Authorization:`Bearer ${userAuth}`
        },
        withCredentials: true });
      toast.success("Drone details saved successfully!");
      form.resetFields();
      setHideDroneForm(false);
      setLoading(false);
      fetchUserDetails();
    } catch (error) {
      toast.error("Failed to save drone details. Please check the form for errors.");
      setLoading(false);
    }
  };

  const handleFieldsSubmit = async (values) => {
    try {
      setLoading(true);
      const payloads = isPayloadNotApplicable ? 'N/A' : values.payloads;
      const addons = isAddonNotApplicable ? 'N/A' : values.addons;

      const userAuth = cookies.get('auth');
      await axios.post(`${requestUrl}/user/details/drone`, { fields: { payloads, addons } }, {
        headers:{
         Authorization:`Bearer ${userAuth}`
        },
        withCredentials: true });
      toast.success("Payload and addon details saved successfully!");
      setEditing(false);
      setLoading(false);
      fetchUserDetails();
    } catch (error) {
      toast.error("Failed to save payload and addon details.");
      setLoading(false);
    }
  };

  const handleSwitchChange = (checked) => {
    setSwitchChecked(checked);
    setIsDisabled(checked);
  };

  const handlePayloadCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsPayloadNotApplicable(checked);
    if (checked) {
      fieldsForm.setFieldsValue({ payloads: ['N/A'] });
    } else {
      fieldsForm.setFieldsValue({ payloads: [] });
    }
  };

  const handleAddonCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsAddonNotApplicable(checked);
    if (checked) {
      fieldsForm.setFieldsValue({ addons: ['N/A'] });
    } else {
      fieldsForm.setFieldsValue({ addons: [] });
    }
  };

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={handleDroneSubmit}>
        <div className="flex gap-5 items-center m-4 flex-wrap">
          <Form.Item
            label="I have no Drones"
            valuePropName="checked"
            className="m-0"
          >
            <Switch
              size="large"
              checked={switchChecked}
              onChange={handleSwitchChange}
              disabled={user?.droneDetails?.drones.length > 0 || user?.droneDetails?.addons[0]!==("N/A" && undefined) || user?.droneDetails?.payloads[0]!==("N/A" && undefined)}
            />
          </Form.Item>
        </div>

        <div>
          <Button
            type="primary"
            onClick={() => setHideDroneForm(!hideDroneForm)}
            className={`flex items-center mx-2 ${hideDroneForm ? 'bg-red-500 text-white' : ''}`}
            disabled={isDisabled}
          >
            {hideDroneForm ? 'Remove' : <>Add Drone &nbsp; <PlusCircleFilled /></>}
          </Button>
        </div>

        {hideDroneForm && <DroneForm handleDroneSubmit={form.submit} form={form} loading={loading} setLoading={setLoading} />}
      </Form>

      <div className="my-5 px-2">
        <Form form={fieldsForm} layout="vertical" onFinish={handleFieldsSubmit} className="">
          <div className='flex gap-5 flex-wrap items-center'>
            <Form.Item
              name="payloads"
              rules={[
                {
                  required: !isPayloadNotApplicable,
                  message: 'Please select at least one',
                },
              ]}
              label={(
                <div className='flex items-center gap-20 justify-between'>
                  <p>Add Payloads</p>
                  <Checkbox
                  disabled ={!editing || switchChecked}

                    onChange={handlePayloadCheckboxChange}
                    checked={isPayloadNotApplicable}
                  >N/A</Checkbox>
                </div>
              )}
              className="min-w-[250px]"
            >
              <HybridSelect
                disabled={!editing || switchChecked || isPayloadNotApplicable}
                initialItems={payloadsList}
                placeholder="Select Payload"
              />
            </Form.Item>

            <Form.Item
              name="addons"
              rules={[
                {
                  required: !isAddonNotApplicable,
                  message: 'Please select at least one',
                },
              ]}
              label={(
                <div className='flex items-center gap-20 justify-between'>
                  <p>Add Addons</p>
                  <Checkbox
                  disabled ={!editing || switchChecked}
                    onChange={handleAddonCheckboxChange}
                    checked={isAddonNotApplicable}
                  >N/A</Checkbox>
                </div>
              )}
              className="min-w-[250px]"
            >
              <HybridSelect
                disabled={!editing || switchChecked || isAddonNotApplicable}
                initialItems={addonsList}
                placeholder="Select Addon"
              />
            </Form.Item>
          </div>

          <div className="flex gap-5">
            <Button
              disabled={!editing || switchChecked}
              className="bg-blue-500 w-[140px] text-white font-bold"
              htmlType="submit"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            {editing ? (
              <Button
                disabled={switchChecked}
                className="font-bold w-[140px] mx-3"
                onClick={handleEditToggle}
              >
                Cancel
              </Button>
            ) : (
              <Button
                disabled={switchChecked}
                className="font-bold w-[140px] mx-3"
                onClick={handleEditToggle}
              >
                Edit
              </Button>
            )}
          </div>
        </Form>
      </div>

      <div className="my-10 flex-grow">
        <DroneData />
      </div>
    </div>
  );
};

export default DroneDetails;
