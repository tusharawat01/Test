import expressAsyncHandler from "express-async-handler";
import { PilotProject } from "../models/pilot/projects.model.js";

export const addNewProject = expressAsyncHandler(async (req, res) => {
    const { data } = req.body;
    if (!data)
        return res.status(400).json({ message: 'All Fields are required' });
    const newProj = await PilotProject.create({
        userId:req.user._id,
        ...data
    });
    console.log(newProj)
    if (!newProj)
        return res.status(500).json({ message: 'Could not Add Project Please try again' });

    
    res.status(201).json({ message: 'Project Added' });

});

export const deleteProj = expressAsyncHandler(async (req, res) => {
    const { projId } = req.params;
    if (!projId) {
        return res.status(400).json({ message: 'Invalid Project' });
    }
    try {
        const data = await PilotProject.findByIdAndDelete(projId);
        if (!data) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not Delete Project. Please try again' });
    }
});

export const getAllProj = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id)
        return res.status(401).json({ message: 'Kindly Login' });
    const allProj = await PilotProject.find({ userId: _id });

    res.status(200).json({ allProj: allProj });

});

