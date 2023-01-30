const User = require('../dbModels/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) =>{
    const {userName, email, password, confirmPassword} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(404).json({message: 'User already exist.'});
        }

        if(password != confirmPassword){
            return res.status(404).json({message: 'Passwords do not match'});
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const result = await User.create({email, password: hashPassword, userName});
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "1hr"});
        return res.status(200).json({result, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong.'})
    }
}

const signin = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({message: 'User does not exist.'});
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: 'Invalid Credential'});
        }
    
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn:"1h"})
        res.status(200).json({result: existingUser, token})
    } catch (error) {
        return res.status(500).json({message: 'Something went wrong.'})
    }
   
}

module.exports = {signin, signup};