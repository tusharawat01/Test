import expressAsyncHandler from "express-async-handler";
import User from "../models/userSchema.js";
import Licenses from "../models/userSubSchemas/licenses.model.js";
import ProjectDetail from "../models/userSubSchemas/projects.model.js";
import DroneDetail from "../models/userSubSchemas/userDroneDetail.model.js";
import WorkExp from "../models/userSubSchemas/workExp.model.js";
import sendEmail from "../service/sendMail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage, deleteImage } from '../utils/imagekit.js';


export const getUserById = expressAsyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;

        if (!_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(_id)
            .select('-password')
            .populate('workExp')
            .populate('droneDetails')
            .populate('projects')
            .populate('licenses');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ message: "Server error" });
    }
});



// *------------GENERAL UPDATE------------
export const updateUserDetails = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const updateData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Server Error. Please try again!" });
    }
});

// *------------Apply for approval ------------
export const handleApply = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: { isApplied: true, status: 'review' } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }


        await sendEmail({
            from: "Aero2Astro Technologies",
            to: updatedUser.email,
            subject: `Application Submission Confirmation for ${updatedUser.fullName}`,
            text: `Hello ${updatedUser.fullName}, thank you for applying for the partnership with us! Your application is now under review, and we will get back to you soon with status updates via email.`,
            html: `
           <head>
    
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e0e0e0;
        }
        .header {
            text-align: center;
            background-color: #23a3df;
            color: #ffffff;
            padding: 20px;
            border-bottom: 3px solid #1a83b5;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .content h2 {
            color: #23a3df;
        }
        .content p {
            line-height: 1.6;
        }
        .credentials {
            background-color: #f4f4f4;
            padding: 10px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            background-color: #23a3df;
            color: #ffffff;
            font-weight:600;
            padding: 10px 20px;
            font-size: 16px;
            margin: 20px 0;
            border-radius: 5px;
            text-decoration: none;
        }
        .footer {
            text-align: center;
            padding: 10px;
            color: #777777;
            border-top: 1px solid #e0e0e0;
        }
        .footer a {
            color: #23a3df;
            text-decoration: none;
        }
    </style>
    </head>
    <body>
    <div class="email-container">
        <div class="header">
            <h1>AERO2ASTRO Tech</h1>
        </div>
        <div class="content">
            <h2>Thank You for Applying </h2>
            <p>
                Dear ${updatedUser.fullName},
            </p>
            <p>
               Thank you for applying for the Drone Pilot partnership with us! Your application is now under review, and we will get back to you soon, you will recieve call or status updates through emails. So stay Tuned!
            </p>
         
          
            <p>
                If you have any questions or need assistance, feel free to contact our support team.
            </p>
            <p>
                Best regards,<br>
                The AERO2ASTRO Tech Team
                <a href="mailto:flywithus@aero2astro.com">flywithus@aero2astro.com</a>
                <br>
                +91 6006535445
            </p>
        </div>
        <div class="footer">
            <p>
                &copy; 2024 AERO2ASTRO Tech. All rights reserved.<br>
                <a href="mailto:flywithus@aero2astro.com">flywithus@aero2astro.com</a>
            </p>
        </div>
    </div>
    </body>
    </html>
    
            `

        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error applying user:", error);
        res.status(500).json({ message: "Server Error. Please try again!" });
    }
});


export const addProjExperience = async (req, res) => {
    try {

        const { fields, clientName, projectDesc, startMon, endMon } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let proj = await ProjectDetail.findOne({ userId });
        if (!proj) {
            proj = new ProjectDetail({ userId });
        }

        if (fields) {
            Object.assign(proj, fields);
        }

        if (clientName && projectDesc && startMon && endMon) {
            const newproject = {
                clientName, projectDesc, startMon, endMon
            }

            if (req.file) {

                const uploadResult = await uploadImage(req.file.buffer, req.file.originalname);
                newproject.image = uploadResult.url;
                newproject.fileId = uploadResult.fileId;
            }
            proj.projects.push(newproject);
        }

        const projectsaved = await proj.save();

        user.projects = projectsaved._id;
        await user.save();

        res.status(201).json({ message: "Project experience added successfully" });
    } catch (error) {
        console.error("Error adding project experience:", error);
        res.status(500).json({ message: "Server Error. Please try again!" });
    }
};


export const deleteProjExperience = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const projectDetail = await ProjectDetail.findOne({ userId });
        if (!projectDetail) {
            return res.status(404).json({ message: "Project details not found" });
        }

        const projectToDelete = projectDetail.projects.id(id);
        if (projectToDelete && projectToDelete.fileId) {
            await deleteImage(projectToDelete.fileId);
        }

        const updatedProjectDetail = await ProjectDetail.findOneAndUpdate(
            { userId },
            { $pull: { projects: { _id: id } } },
            { new: true }
        );

        if (!updatedProjectDetail) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project experience deleted successfully", updatedProjectDetail });
    } catch (error) {
        console.error("Error deleting project experience:", error);
        res.status(500).json({ message: "Server Error. Please try again!" });
    }
};


// *----------------------- WORK EXPERIENCE CRUD----------------------

export const addWorkExperience = async (req, res) => {
    try {
        const { jobType, companyName, designation, startMon, endMon } = req.body;
        if (!(jobType && companyName && designation && startMon && endMon)) {
            return res.status(400).json({ message: 'All fields are required' });

        }

        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let workExp = await WorkExp.findOne({ userId });
        if (!workExp) {
            workExp = new WorkExp({ userId });
        }

        const work = {
            jobType,
            companyName,
            designation,
            startMon,
            endMon,
        };

        if (req.file) {
            const uploadResult = await uploadImage(req.file.buffer, req.file.originalname);
            work.image = uploadResult.url;
            work.fileId = uploadResult.fileId;
        }

        workExp.works.push(work);

        const worksaved = await workExp.save();
        user.workExp = worksaved._id;
        await user.save();

        res.status(201).json({ message: 'Work experience added successfully' });
    } catch (error) {
        console.error('Error adding work experience:', error);
        res.status(500).json({ message: 'Server Error. Please try again!' });
    }
};

export const deleteWorkExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const workExpDoc = await WorkExp.findOne({ userId });
    if (!workExpDoc) {
        return res.status(404).json({ message: 'Work experience document not found' });
    }

    const work = workExpDoc.works.id(id);
    if (!work) {
        return res.status(404).json({ message: 'Work experience not found' });
    }
    const { fileId } = work;
    if (fileId && work) {
        try {

            await deleteImage(fileId);
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting image from ImageKit', error });
        }
    }
    workExpDoc.works.pull({ _id: id });
    await workExpDoc.save();

    res.status(200).json({ message: 'Work experience deleted successfully' });
});

// ---------------------------------------------------------

//*----------------------------DRONE DETAILS CRUD---------------------------
export const addDroneDetail = async (req, res) => {
    try {
        const { drones, fields } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let droneDetail = await DroneDetail.findOne({ userId: req.user._id });

        if (!droneDetail) {
            droneDetail = new DroneDetail({ userId: req.user._id });
        }

        if (drones) {
            droneDetail.drones.push(drones);
        }


        if (fields) {
            Object.assign(droneDetail, fields);

        }

        const savedDroneDetail = await droneDetail.save();

        user.droneDetails = savedDroneDetail._id;
        await user.save();

        res.status(201).json(savedDroneDetail);
    } catch (error) {
        console.error("Error adding drone detail:", error);
        res.status(500).json({ message: "Server Error. Please try again!" });
    }
};


export const deleteDroneDetail = async (req, res) => {
    try {
        const { _id } = req.user;
        const { id } = req.params;

        const updatedDroneDetail = await DroneDetail.findOneAndUpdate(
            { userId: _id },
            { $pull: { drones: { _id: id } } },
            { new: true }
        );

        if (!updatedDroneDetail) {
            return res.status(404).json({ message: "Drone detail not found" });
        }

        res.status(200).json(updatedDroneDetail);
    } catch (error) {
        console.error("Error deleting drone detail:", error);
        res.status(500).json({ message: "Server Error. Please try again!" });
    }
};

//--------------------------------------------------------------------------------------

//*------------------------------LICENSE---------------------------


export const addLicense = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { licenseNumber, classUas, pilotName, licenseName, dateOfIssuance } = req.body;

        if (!(licenseNumber && classUas && licenseName && pilotName && dateOfIssuance))
            res.status(400).json({ message: "All Fields are required" })

        if (req.file && req.file.size > 1 * 1024 * 1024) {
            return res.status(400).json({ message: "File size cannot exceed 1MB" });
        }

        const image = req.file;
        const uploadResponse = await uploadImage(image.buffer, image.originalname);

        let licenseDoc = await Licenses.findOne({ userId: _id });
        if (!licenseDoc) {
            licenseDoc = new Licenses({ userId: _id, licenses: [] });
        }



        const newLicense = {
            licenseName,
            licenseNumber,
            pilotName,
            classUas,
            dateOfIssuance,
            image: uploadResponse.url,
            fileId: uploadResponse.fileId
        };

        licenseDoc.licenses.push(newLicense);
        const saveRef = await licenseDoc.save();
        if (!saveRef)
            throw new Error("Error saving License");

        user.licenses = saveRef._id;
        await user.save();

        res.status(201).json({ message: "Successfully saved" });
    } catch (error) {
        console.log(error);
    }
});


export const deleteLicense = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { licenseId } = req.params;


    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const licenseDoc = await Licenses.findOne({ userId });
    if (!licenseDoc) {
        return res.status(404).json({ message: 'Licenses document not found' });
    }

    const license = licenseDoc.licenses.id(licenseId);
    if (!license) {
        return res.status(404).json({ message: 'License not found' });
    }

    const fileId = license.fileId;
    if (fileId) {
        try {
            await deleteImage(fileId);
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting image from ImageKit', error });
        }
    }

    licenseDoc.licenses.pull({ _id: licenseId });
    await licenseDoc.save();

    res.status(200).json({ message: 'License deleted successfully' });
});

// ================== Survey ==========================
export const getSurveyResponse = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const {answer} = req.body;

    try {
        const isUser = await User.findByIdAndUpdate(_id);

        if (!isUser) {
            return res.status(404).json({ message: "User not found" });
        }
        isUser.surveyAnswer = answer;
        await isUser.save();
        res.status(200).json({ message: "Thankyou for this response" });
    } catch (error) {
        console.error("Something went wront while saving response", error);
        res.status(500).json({ message: "Something went wront while saving response, Please Try Again !" });
    }
});

