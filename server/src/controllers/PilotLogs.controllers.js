import expressAsyncHandler from "express-async-handler";
import { PilotLog } from "../models/pilot/pilotLogs.model.js";

export const addNewLog = expressAsyncHandler(async (req, res) => {
    const { data } = req.body;
    console.log(data)
    if (!data)
        return res.status(400).json({ message: 'All Fields are required' });
    const newLog = await PilotLog.create({
        userId:req.user._id,
        ...data
    });
    console.log(newLog)
    if (!newLog)
        return res.status(500).json({ message: 'Could not Add Record Please try again' });

    
    res.status(201).json({ message: 'Record Added' });

});

export const deleteLog = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: 'Invalid Record' });
    const data = await PilotLog.findByIdAndDelete({ _id:id });
    if (!data)
        return res.status(500).json({ message: 'Could not Delete record Please try again' });

    res.status(200).json({ message: 'Record Deleted' });

});

export const getAllLog = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id)
        return res.status(401).json({ message: 'Kindly Login' });
    const allLog = await PilotLog.find({ userId: _id }).populate("project");

    res.status(200).json({ allLog: allLog });

});

