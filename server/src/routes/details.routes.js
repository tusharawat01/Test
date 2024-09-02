import express from "express"

import {
    addDroneDetail,
    addLicense, addProjExperience, addWorkExperience, deleteDroneDetail, deleteLicense,
      deleteProjExperience,
      deleteWorkExperience,
 getSurveyResponse,
 handleApply,
 updateUserDetails, 
} from "../controllers/userDetail.controller.js";


import verifyUserJwt from "../middlewares/verifyUserJwt.js";
import upload from "../utils/multerconfig.js";
import uploadAvatar from "../utils/multerForImg.js";
import { handlePilotApproval, verifyAdminAuth } from "../controllers/admin.controller.js";
import { getAllUsers, getUsersRegisteredToday } from "../controllers/userfetch.controller.js";
import multer from "multer";
import { updateAvatar } from "../controllers/user.controller.js";
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

router.put("/user/details/update", verifyUserJwt, updateUserDetails);
router.put('/user/updateAvatar',verifyUserJwt, uploadAvatar.single('avatar'),multerErrorHandler, updateAvatar);


router.post('/user/details/work', verifyUserJwt,upload.single('file'),multerErrorHandler, addWorkExperience);
router.delete('/user/details/work/:id', verifyUserJwt, deleteWorkExperience);


router.post('/user/details/project', verifyUserJwt, upload.single('projectFile'),multerErrorHandler,addProjExperience);
router.delete('/user/details/project/:id', verifyUserJwt, deleteProjExperience);

router.post('/user/details/drone', verifyUserJwt, addDroneDetail);
router.delete('/user/details/drone/:id', verifyUserJwt, deleteDroneDetail);


router.post('/user/details/licenses',verifyUserJwt, upload.single('image'),multerErrorHandler, addLicense);
router.delete('/user/details/licenses/:licenseId',verifyUserJwt, deleteLicense);

router.post('/user/survey', verifyUserJwt, getSurveyResponse);
router.get("/user/approval",verifyUserJwt,handleApply);

router.get("/user/all",verifyAdminAuth,getAllUsers);
router.get("/user/all/new",verifyAdminAuth,getUsersRegisteredToday);
router.put("/user/approve/:id",verifyAdminAuth,handlePilotApproval);


export default router; 