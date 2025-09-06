import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

import User from "./models/user.model.js"

export const protectedRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token Provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid Token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({
                message: "User not Found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protected  middleware", error)
        return res.status(500).json({
            message: "Internal server Error" 
        })
    }
}

