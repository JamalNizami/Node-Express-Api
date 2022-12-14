const { response } = require('express')
const asyncHandler = require('express-async-handler')

const Goal = require('../model/goalsModel')
const User = require('../model/userModel')

//@desc    Get Goals 
//@route   Get /api/goals
//@access  Private
const getGoals =asyncHandler( async(req , res) => {
    const goals = await Goal.find({user: req.user.id})
    res.status(200).json(goals)
})

//@desc    Set Goals 
//@route   POST /api/goals
//@access  Private
const setGoals =asyncHandler(async(req , res) => {
    
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })

    res.status(200).json(goal)
})

//@desc    Update Goals 
//@route   UPDATE /api/goals/:id
//@access  Private
const updateGoals =asyncHandler( async(req , res) => {

    const goal = await Goal.findById(req.params.id)

    const user = await User.findById(req.user.id)

    // check the user 
    if(!user){
        res.status(401)
        throw new Error("User Not Found")
    }

    // make sure only logged in user matches the goal user
    if(goal.user.toString() !== user.id ){
        res.status(401)
        throw new Error("User Not Match")
    }


    if(!goal){
        res.status(400)
        throw new Error('Goal not Found') 
    } 
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    } )

    res.status(200).json(updatedGoal)
})



//@desc    Delete Goals 
//@route   DELETE /api/goals/:id
//@access  Private
const deleteGoals =asyncHandler( async(req , res) => {

    const goal = await Goal.findById(req.params.id)

    const user = await User.findById(req.user.id)

    // check the user 
    if(!user){
        res.status(401)
        throw new Error("User Not Found")
    }

    // make sure only logged in user matches the goal user
    if(goal.user.toString() !== user.id ){
        res.status(401)
        throw new Error("User Not Match")
    }


    if(!goal){
        res.status(400)
        throw new Error('Goal Not Found')
    }

    await goal.remove()
    res.status(200).json({id: req.params})
})



module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}