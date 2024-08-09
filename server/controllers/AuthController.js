import jwt from "jsonwebtoken"
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import {rename, renameSync, unlink, unlinkSync} from "fs"

const maxAge = 3*24*60*60*1000;
const createToken = (email, userId) =>{
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn:maxAge})
};

//signup
export const signup = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password is required")
        }
        const user = await User.create({email, password});
        res.cookie("jwt", createToken(email, user.id),{
            maxAge,
            httpOnly: true,
            secure:true,
            sameSite:"None",
        });
        return res.status(201).json({
            user:{
                id: user.id,
                email:user.email,
                profileSetup:user.profileSetup,
            },
        });
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

//login

export const login = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password is required")
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send("User Not Found")           
        }
        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(404).send("Password Is Incorrect")                
        }
        res.cookie("jwt", createToken(email, user.id),{
            maxAge,
            secure:true,
            httpOnly: true,
            sameSite:"None",
        });
        return res.status(200).json({
            user:{
                id: user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName :user.firstName,
                lastName : user.lastName,
                image: user.image,
                color:user.color,
            },
        });
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// get user info 


export const getUserInfo = async (req, res, next)=>{
    try{
        const userData =await User.findById(req.userId);
        if(!userData){
            return res.status(404).send("User Not Found!")
        }
        return res.status(200).json({
                id: userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName :userData.firstName,
                lastName : userData.lastName,
                image: userData.image,
                color:userData.color,
        });
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

//updateProfile


export const updateProfile = async (req, res, next)=>{
    try{
        const {userId} = req;
        const {firstName, lastName, color} = req.body;
        if(!firstName || !lastName ){
            return res.status(400).send("First Name Last Name and Color is required!")
        }

        const userData = await User.findByIdAndUpdate(userId,{
            firstName, lastName, color, profileSetup:true
             },{new:true,runvalidators:true});
         //send the data to user    
        return res.status(200).json({
                id: userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName :userData.firstName,
                lastName : userData.lastName,
                image: userData.image,
                color:userData.color,
        });
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

//add-profile-image 

export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("Upload Your Image!");
        }
        const date = Date.now();
        let fileName = `uploads/profiles/${date}_${req.file.originalname}`;
        
        try {
            renameSync(req.file.path, fileName);
        } catch (error) {
            console.error("Error renaming file:", error);
            return res.status(500).send("Error processing the uploaded file.");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        return res.status(200).json({
            image: updatedUser.image,
        });
    } catch (error) {
        console.error("Error in addProfileImage:", error);
        return res.status(500).send("Internal Server Error");
    }
};



//remove-profile-image 

export const removeProfileImage = async (req, res, next)=>{
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("User Not Found");
        }
        if(user.image){
            unlinkSync(user.image);
        }
        user.image=null;
        await user.save();
        return res.status(200).send("Profile Image Removed Successfully");
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

//logout

export const logout = async (req, res, next)=>{
    try{
        res.cookie("jwt", "",{maxAge:1, secure:true, sameSite:"None"})
        return res.status(200).send("Logout successfull.");
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};