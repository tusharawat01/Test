import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import Admin from "../models/admin.model.js";
import sendEmail from "../service/sendMail.js";
import mongoose from "mongoose";
import User from "../models/userSchema.js";


const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({
                message: "Credentials are incorrect"
            });
        }

       if(!admin.password)
        return res.status(401).json({message:"Kindly Create or reset your account"})

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Credentials are incorrect"
            });
        }

        const token = jwt.sign({ _id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
            expiresIn: "1w"
        });


        res.status(200).json({
            token:token,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const verifyAdminAuth = asyncHandler(async (req, res, next) => {
  
    const token = req.headers.adauth || (req.headers.cookie && req.headers.cookie.split('adauth=')[1]);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded._id).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        req.admin = admin;


        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized" });
    }
});

const defaultAdminEmail = process.env.ADMIN_EMAIL;  //admin mail

const resetPassword = asyncHandler(async (req, res) => {
    const { email, newpassword } = req.body;

    try {
        if(email!==defaultAdminEmail)
            return res.status(400).json({message:"Something went wrong."});

        const existingAdmin = await Admin.findOne({ email: defaultAdminEmail });

        if (!existingAdmin) {
            if (email !== defaultAdminEmail) {
                return res.status(400).json({ message: "Email does not match the allowed email for admin creation" });
            }
            const admin = new Admin({ email: defaultAdminEmail });
            await admin.save();
        }


        const generatedEmailOTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        await sendEmail({
            from:"Aero2Astro Tech <tech@aero2astro.com> ",
            to: defaultAdminEmail,
            subject: `Aero2Astro Admin credentials Reset OTP code: ${generatedEmailOTP}`,
            text: `Your credentials Reset OTP code: ${generatedEmailOTP}\nIt is valid for 5 minutes only.`,
            html: `<html lang="en">
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
                    .otp {
                        display: inline-block;
                        background-color: #23a3df;
                        color: #ffffff;
                        padding: 10px 20px;
                        font-size: 20px;
                        margin: 20px 0;
                        border-radius: 5px;
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
                        <h2>Credentials Reset OTP from ${email}</h2>
                        <p>
                            We received a request to reset the credentials from ${email} for your account of onboarding dashboard. To proceed with the password reset, please use the following One-Time Password (OTP):
                        </p>
                        <div class="otp">
                            ${generatedEmailOTP}
                        </div>
                        <p>
                            Please enter this OTP in the password reset form to continue. This OTP is valid for the next 5 minutes.
                        </p>
                        <p>
                            If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                        </p>
                        <p>
                            Best regards,<br>
                            The AERO2ASTRO Tech Team
                            <a href="mailto:flywithus@aero2astro.com">flywithus@aero2astro.com</a>
            
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

   
        const token = jwt.sign({ email: email, newpassword: newpassword, otp: generatedEmailOTP, otpExpires: new Date(Date.now() + 5 * 60 * 1000) }, process.env.JWT_SECRET, { expiresIn: "5m" });

        res.status(200).json({token:token, message: "Verification code sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const verifyResetPasswordOtp = asyncHandler(async (req, res) => {
    const { otp } = req.body;

  
    const token = req.headers.adreset || (req.headers.cookie && req.headers.cookie.split('adreset=')[1]);


    if (!token) {
        return res.status(401).json({ message: "Session Expired or Invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) 
        return res.status(401).json({ message: "Invalid Session" });

        const isOTPValid = parseInt(decoded.otp) === parseInt(otp) && decoded.otpExpires > Date.now().toLocaleString();
        if (isOTPValid) {
          
            const admin = await Admin.findOne({ email: decoded.email });

            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            const hashedPassword = await bcrypt.hash(decoded.newpassword, 10);

            admin.password = hashedPassword;
            await admin.save();

            const token = jwt.sign({ _id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
                expiresIn: "1w"
            });
         

            return res.status(200).json({token:token, message: "Password reset successful" });
        } else {
            return res.status(400).json({ message: "Invalid OTP or expired" });
        }

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized" });
    }
});


const getAdminDetail = asyncHandler(async (req, res) => {
    const admin = req.admin;
    if (!admin)
       return res.status(401);

    res.status(200).json({ admin });
})

// handle approval
export const handlePilotApproval = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const existedUser = await User.findById(id);
        if(!existedUser)
            return res.status(404).json({message:"User not exist"});
        if(existedUser.status==='approved' )
            return res.status(400).json({message:"User already approved"});
        if(existedUser.status==='rejected' )
            return res.status(400).json({message:"User is rejected"});

        if(existedUser.status==='review'){
            existedUser.status = 'approved'
        }
        await existedUser.save();

        await sendEmail({
            from:"Aero2Astro Tech <tech@aero2astro.com> ",
            to: existedUser.email,
            subject: `Approval for ${existedUser.fullName} `,
            text: `Congratulations! ${existedUser.fullName} You have been approved by Aero2astro for the drone pilot partnership with us`,
            html: `<html lang="en">
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
        .otp {
            display: inline-block;
            background-color: #23a3df;
            color: #ffffff;
            padding: 10px 20px;
            font-size: 20px;
            margin: 20px 0;
            border-radius: 5px;
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
            <h1>Congratulations ${existedUser.fullName}</h1>
        </div>
        <div class="content">
            <p>
                Dear ${existedUser.fullName},
            </p>
            <p>
                We are glad to inform you that your application for the drone pilot partnership with aero2astro has been approved.
            </p>
            
            <p>
                You can now manage your profile and portfolio/ drone assets by logging in to the Pilot Portfolio management System with the same credentials for free.
            </p>
             
            <p>
                Best regards,<br>
                The AERO2ASTRO Tech Team
                <a href="mailto:flywithus@aero2astro.com">flywithus@aero2astro.com</a>

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

        return res.status(200).json({message:"Pilot has been approved"});
    

})


export { Login, getAdminDetail, verifyAdminAuth, resetPassword, verifyResetPasswordOtp,  };
