const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

const protect = asyncHandler(async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
        try {
            // Get token from Header 
            token = req.headers.authorization.split(' ')[1]

            // verify the token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get token from user

            req.user = await User.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error("Not Authorized")
        }
    } else {
        res.status(401)
        throw new Error("Not Authorized , No token")
    }
} )


module.exports = {
    protect,
}

