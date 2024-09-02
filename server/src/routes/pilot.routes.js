import express from "express"
import verifyUserJwt from "../middlewares/verifyUserJwt.js";
import { addNewProject, deleteProj, getAllProj } from "../controllers/pilotproj.controllers.js";
import { addNewLog, deleteLog, getAllLog } from "../controllers/PilotLogs.controllers.js";
import { addNewBattery, addNewDrone, addPayload, getAllAssets } from "../controllers/PilotAssets.controller.js";
import { addNewLink, deleteLink } from "../controllers/SocialLinks.controller.js";
// import { addWorkExperience, deleteWorkExperience } from "../controllers/workExp.controllers.js";
import { updateAvatar, userLogin } from "../controllers/user.controller.js";
import uploadAvatar from "../utils/multerForImg.js"
import multer from "multer";
import upload from "../utils/multerconfig.js";
import { getUserById, addWorkExperience, deleteWorkExperience } from "../controllers/userDetail.controller.js";

const router = express.Router();



const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File size cannot exceed 1MB" });
        }
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// login route
router.post("/login", userLogin);
router.get("/detail", verifyUserJwt, getUserById);

//  pilot avatar update 
router.put('/updateAvatar', verifyUserJwt, uploadAvatar.single('avatar'), multerErrorHandler, updateAvatar);

// work exp routes
router.post('/add/workexp', verifyUserJwt, addWorkExperience);
router.delete('/delete/workexp/:id', verifyUserJwt, deleteWorkExperience);

// Projects routes
router.get('/projects/all', verifyUserJwt, getAllProj)
router.delete('/project/delete/:projId', verifyUserJwt, deleteProj)
router.post('/project/new', verifyUserJwt, addNewProject)

// Logs Routes
router.get('/logs/all', verifyUserJwt, getAllLog)
router.delete('/delete/log/:id', verifyUserJwt, deleteLog)
router.post('/log/new', verifyUserJwt, addNewLog)

// Assets Routes
router.get('/assets/all', verifyUserJwt, getAllAssets);
router.post('/assets/drone/new', verifyUserJwt, addNewDrone);
router.post('/assets/battery/new', verifyUserJwt, addNewBattery);
router.post('/assets/payloads/update', verifyUserJwt, addPayload);

// social links
router.post('/add/socialLink', verifyUserJwt, addNewLink)
router.delete('/delete/socialLink', verifyUserJwt, deleteLink)

// work exp
router.post('/add/work', verifyUserJwt, upload.single('file'), multerErrorHandler, addWorkExperience);
router.delete('/delete/work/:id', verifyUserJwt, deleteWorkExperience);


export default router;