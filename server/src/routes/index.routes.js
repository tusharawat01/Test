import express from "express"
import {  generateAndSendEmailOTP, generateAndSendForgotPasswordOTP, generateAndSendPhoneOTP, getUser, registerationConfirmationMail, resendEmailOTP, resendPhoneOTP, updateAvatar, updatePassword, userLogin, userRegister, verifyEmailOTP, verifyForgotPassOTP, verifyPhoneOTP, verifySession } from "../controllers/user.controller.js";
import { Login, getAdminDetail, resetPassword, verifyAdminAuth, verifyResetPasswordOtp } from "../controllers/admin.controller.js";
import verifyUserJwt from "../middlewares/verifyUserJwt.js";
import axios from "axios"


const router = express.Router();

router.post("/user/register",userRegister);
router.post("/notification/confirmation",registerationConfirmationMail);
router.post("/user/login",userLogin);
router.get("/user/verifysession",verifySession);
router.get("/user/get",verifyUserJwt,getUser);

router.post("/user/sendEmailOTP",generateAndSendEmailOTP);
router.post("/user/verifyEmail",verifyEmailOTP);
router.post("/user/resendEmail",resendEmailOTP);

router.post("/user/forgot/password",generateAndSendForgotPasswordOTP);
router.post("/user/verify/forgot/otp",verifyForgotPassOTP);
router.post("/user/password/update",updatePassword);

router.post("/user/sendPhoneOTP",generateAndSendPhoneOTP);
router.post("/user/verifyPhone",verifyPhoneOTP);
router.post("/user/resendPhoneOTP",resendPhoneOTP);
 

router.get("/admin/detail",verifyAdminAuth,getAdminDetail);
router.post("/admin_login",Login);
router.post("/verify/admin",verifyResetPasswordOtp);
router.post("/reset/admin/password",resetPassword);


router.get('/pincode/:value', async (req, res) => {
    const { value } = req.params;
    try {
      // const response = await axios.get(`https://api.pincode-finder.com/${value}`);
      const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch pincode details' });
    }
  });



export default router
