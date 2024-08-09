//token for getting user info

import jwt from 'jsonwebtoken'

export const verifyToken  = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).send("You Are Not Authenticated!")
    }else{
        jwt.verify(token,process.env.JWT_KEY, async(err, payload)=>{
            if(err){
                return res.status(403).send("Not Valid!")
            }else{
                req.userId= payload.userId;
                next();
            }
        })
    }
};