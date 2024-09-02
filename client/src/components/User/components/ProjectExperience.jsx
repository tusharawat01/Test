"use client"

import { useContext, useEffect, useState } from "react";
import { Button, Form, Input, DatePicker, Upload } from "antd";
import { InfoCircleOutlined, PlusCircleFilled, UploadOutlined } from "@ant-design/icons";
import { UserContext } from "../../../Contexts/User";
import dayjs from 'dayjs';
import axios from 'axios';
import { requestUrl } from "../../../utils/constants";
import toast from "react-hot-toast";
import HybridSelect from "./commons/HybridSelect";
import { monitoring, surveyMapping, visuals } from "../../../data/defaultList";
import ProjectsCards from "./commons/ProjectsCards";
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' ,sameSite:'lax'});

const ProjectExperience = () => {
    const { user, fetchUserDetails } = useContext(UserContext);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({});
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [editing, setEditing] = useState(true);
    const [loading, setLoading] = useState(false);

    const currentYear = dayjs().year();

    const disabledDate = (current) => {
        return current && current.year() > currentYear;
    };

    useEffect(() => {
        if (user && user.projects) {
            setFormData(user.projects);
            form.setFieldsValue(user.projects);
        }
    }, [user, form]);

    const props = {
        name: 'file',
        maxCount: 1,
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isPDF) {
                toast.error('Only PDF files are allowed!');
                return Upload.LIST_IGNORE;
            }
            if (!isLt1M) {
                toast.error('File must be less than 1MB!');
                return Upload.LIST_IGNORE;
            }
            return true;
        },
    };

    const handleProjectExperienceSubmit = async (values) => {
        try {
            setLoading(true)

            const formData = new FormData();

            if (values.projectFile) {
                formData.append('projectFile', values.projectFile[0].originFileObj);
            }

            formData.append('clientName', values.clientName);
            formData.append('projectDesc', values.projectDesc);
            formData.append('startMon', dayjs(values.startMon).format('YYYY-MM'));
            formData.append('endMon', dayjs(values.endMon).format('YYYY-MM'));
            if (dayjs(values.startMon).format('YYYY-MM') >= dayjs(values.endMon).format('YYYY-MM')) {
                toast.error("Start Month can't be greater");
                setLoading(false);

                return;
            }
            const userAuth = cookies.get('auth');
            await axios.post(`${requestUrl}/user/details/project`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization :`Bearer ${userAuth}`
                },
            });

            setShowProjectForm(false);
            toast.success("Successfully saved");
            setLoading(false)

            fetchUserDetails();
        } catch (error) {
            toast.error("Error Saving");
            setLoading(false);
        }
    };

    const handleProjectDropdownSubmit = async (values) => {
        try {
            setLoading(true)
            const userAuth = cookies.get('auth');
            await axios.post(`${requestUrl}/user/details/project`, { fields: values }, {
                headers:{
                 Authorization:`Bearer ${userAuth}`
                },
                withCredentials: true });

            toast.success("Successfully saved");
            setEditing(false);
            setLoading(false)

            fetchUserDetails();
        } catch (error) {
            toast.error("Error Saving");
            setLoading(false)
        }
    };

    const handleEditToggle = () => {
        setDisabled(!disabled);
        setEditing(!editing);
    };

    return (
        <div>
            <div className="  p-3">
                <p className="px-3 py-3"> Add Project Experiences</p>
                <Button
                    type="primary"
                    onClick={() => setShowProjectForm(!showProjectForm)}
                    className={`flex items-center mx-2 ${showProjectForm ? 'bg-red-500 text-white' : ''}`}
                >
                    {showProjectForm ? 'Remove' : <> Add Project Experience &nbsp; <PlusCircleFilled /></>}
                </Button>

                {showProjectForm && (
                    <div className="my-8 relative w-fit rounded-lg overflow-clip border-2 border-blue-500 px-4 ">
                        <Form layout="vertical" onFinish={handleProjectExperienceSubmit}>
                            <div className="flex p-2 items-center gap-3 flex-wrap">
                                <Form.Item
                                    name="clientName"
                                    className="min-w-[250px]"
                                    label="Client Name"
                                    rules={[{ required: true, message: 'Please enter client name' }]}
                                >
                                    <Input placeholder="Client Name" />
                                </Form.Item>
                                <Form.Item
                                    className="min-w-[250px]"
                                    name="projectDesc"
                                    label="Project Description"
                                    rules={[{ required: true, message: 'Please enter project description' }]}
                                >
                                    <Input placeholder="Project Description" />
                                </Form.Item>
                                <Form.Item
                                    className="min-w-[250px]"
                                    name="startMon"
                                    label="Start Date"
                                    rules={[{ required: true, message: 'Please select start date' }]}
                                >
                                    <DatePicker format="MM/YYYY" className="w-[100%]" picker="month" disabledDate={disabledDate} />
                                </Form.Item>
                                <Form.Item
                                    className="min-w-[250px]"
                                    name="endMon"
                                    label="End Date"
                                    rules={[{ required: true, message: 'Please select end date' }]}
                                >
                                    <DatePicker format="MM/YYYY" className="w-[100%]" picker="month" disabledDate={disabledDate} />
                                </Form.Item>
                                <Form.Item
                                    name="projectFile"
                                    label="Upload Certificate"
                                    valuePropName="fileList"
                                    tooltip={{
                                        title: "Upload Relavant experience certificate or any proof of work on project. The file should be in pdf format with size less than 1 mb ",
                                        icon: <InfoCircleOutlined />
                                    }}
                                    getValueFromEvent={e => e && e.fileList}
                                >
                                    <Upload {...props}>
                                        <Button icon={<UploadOutlined />}>Upload Certificate</Button>
                                    </Upload>
                                </Form.Item>
                                <Button
                                    disabled={loading}
                                    type="primary" htmlType="submit" className=" mx-1">
                                    {loading ? "Saving..." : "Save Project Experience"}</Button>
                            </div>
                        </Form>
                    </div>
                )}
            </div>

            <Form layout="vertical" form={form} onFinish={handleProjectDropdownSubmit}>
                <div className='flex  gap-5 flex-wrap items-center p-5'>
                    <Form.Item
                        className="w-[250px] m-0"
                        label="Survey/Mapping"
                        name="mapping"
                        rules={[{ required: true, message: 'Please select at least one survey/mapping skill' }]}
                    >
                        <HybridSelect
                            initialItems={surveyMapping}
                            disabled={!editing}
                            placeholder="3d/Mapping"
                        />
                    </Form.Item>
                    <Form.Item
                        className="w-[250px] m-0"
                        label="Monitoring"
                        name="monitoring"
                        rules={[{ required: true, message: 'Please select at least one monitoring skill' }]}
                    >
                        <HybridSelect
                            initialItems={monitoring}
                            disabled={!editing}
                            placeholder="Monitoring"
                        />
                    </Form.Item>
                    <Form.Item
                        className="w-[250px] m-0"
                        label="Inspection - Visual/Thermal"
                        name="inspection"
                        rules={[{ required: true, message: 'Please select at least one inspection skill' }]}
                    >
                        <HybridSelect
                            initialItems={visuals}
                            disabled={!editing}
                            placeholder="Visual/Thermal"
                        />
                    </Form.Item>
                </div>
                <div className="flex gap-5">
                    <Button
                        disabled={!editing || loading}
                        className="bg-blue-500 w-[140px] text-white font-bold ml-5 my-2" htmlType="submit">
                        {loading ? "Saving ..." : "Save"}
                    </Button>
                    {editing ? (
                        <>
                            <Button className="font-bold w-[100px] mx-3 my-2" onClick={handleEditToggle}>Cancel</Button>
                        </>
                    ) : (
                        <Button className="font-bold w-[100px] mx-3 my-2" onClick={handleEditToggle}>Edit</Button>
                    )}
                </div>
            </Form>

            <div className="mt-8 ">
                <ProjectsCards />
            </div>
        </div>
    );
}

export default ProjectExperience;
