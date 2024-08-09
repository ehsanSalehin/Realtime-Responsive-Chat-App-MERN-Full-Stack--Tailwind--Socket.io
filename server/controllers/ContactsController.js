import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

export const searchContacts = async (req, res, next)=>{
    try{
        const {search} = req.body;
        if(search === undefined || search === null){
            return res.status(400).send("Search Is Required!")
        }
        const removeFromSearch = search.replace(/[{}[\]()*&^%$#@!|":';]/g, '');
        const regexp = new RegExp (removeFromSearch,"i");
        //Do not show the Id of the current user
        const contacts = await User.find({
            $and:[{_id:{$ne:req.UserId}}],
            $or:[{firstName:regexp}, {lastName:regexp}, {email:regexp}],
        });
        return res.status(200).json({contacts});
    }catch(err){
        console.log(err);

        return res.status(500).send("Internal Server Error");
    }
};

//for group

export const getContactsForDirectMessageList = async (req, res, next)=>{
    try{
        let {userId}=req;
        //verifing Tokens to make sure it has token
        userId=new mongoose.Types.ObjectId(userId);
        //it's not a single contact ==> aggregate (pipeline of queries we want to run)
        const contacts = await Message.aggregate([
            {   
                //match sender or recipient with user id
                $match:{
                    $or:[{sender:userId},{recipent:userId}],
                },
            },
            {   
                    //sorting them according timestamp
                $sort:{
                    timestamp : -1
                },
                
            },
            {
                //condition: uf sender is user id==> if recipient is not user id then sender is user id
                $group:{
                    _id:{
                        $cond:{
                            if:{$eq:["$sender",userId]},
                            then:"$recipent",
                            else:"#sender",
                        },
                    },
                    lastMessageTime:{$first:"$timestamp"},
                },
            },
            //getting the contact info the messages
            {$lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo",
            },
        },
        {
            $unwind:"$contactInfo",
        },
        {
            $project:{
                _id:1,
                lastMessageTime:1,
                email:"$contactInfo.email",
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
                image:"$contactInfo.image",
                color:"$contactInfo.color",
            },
        },
        {
            $sort:{lastMessageTime: -1},
        }
        ]);
        return res.status(200).json({contacts});
    }catch(err){
        console.log(err);

        return res.status(500).send("Internal Server Error");
    }
};


//group

export const getAllContacts = async (req, res, next)=>{
    try{
        const users = await User.find({_id:{$ne:req.user.id}},"firstName lastName _id email");
        const contacts = users.map((user)=>({
            label: user.firstName ? `${user.firstName}${user.lastName}`: user.email,
            value: user._id,
        }))
        return res.status(200).json({contacts});
    }catch(err){
        console.log(err);

        return res.status(500).send("Internal Server Error");
    }
};