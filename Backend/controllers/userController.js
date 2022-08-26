const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')


//@desc    Register new User
//@route   post /api/users
//@access  Public
const registerUser = asyncHandler ( async(req,res) => {
    
    // for getting value form body 
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    // check if user Exist
    
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error("user already Exist")
    }

    // hash the password

    const slat = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password ,slat)

    // create the User 

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }else{
        res.status(400)
        throw new Error("invild user data")
    }


    // res.json({
    //     Message: 'Register User'
    // })
})

//@desc    Authenticate a User
//@route   post /api/users/login
//@access  Public
const loginUser = (req,res) => {
    res.json({
        Message: 'Login User'
    })
}

//@desc    Get User data
//@route   get /api/users/me
//@access  Public
const getMe = (req,res) => {
    res.json({
        Message: 'User data is here'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe,

}