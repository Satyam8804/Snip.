import {User} from '../models/user.model.js'
import jwt  from 'jsonwebtoken';
import { generateAccessToken } from '../utils/generateToken.js';

export const refreshAccessToken = async(req,res)=>{
    try {
        const token = req.cookies.refreshToken;

        if(!token){
            return res.status(401).json({message:"No refresh token"});
        }

        const decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);

        if(!user || user.refreshToken !== token){
            return res.status(401).json({message:"Invalid refresh token"});
        }

        const newAccessToken = generateAccessToken(user._id);

        return res.status(200).json({
            accessToken:newAccessToken
        })
    } catch (error) {
        console.error(error)
        res.status(401).json({message:"Invalid or expired refresh token"})
    }
}