const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser=asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password)
    {
        res.status(400);
        throw new Error("All feilds are mandatory");
    }

    const userAvailable=await User.findOne({email});
    if(userAvailable)
    {
        res.status(400);
        throw new Error("User already Registered");
    }

    //Hash password
    const hashedPassword= await bcrypt.hash(password,10); 
    console.log("Hashed Password:",hashedPassword);
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    });
    if(user){
        res.status(201).json({
            success:true,
            message:"User Registered successfully",
            _id:user.id, 
            email:user.email
        });
    }
    else{
        res.status(404);
        throw new Error("User data is not valid");
    }
    console.log(`User created ${user}`);
    res.json({message:"Register the user"});
});

//@desc Login the user
//@route POST /api/users/login
//@access public
const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All feilds are mandatory");
    }

    const user = await User.findOne({email});

    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign(
        {
            user:{
                username : user.username,
                email : user.email,
                id : user.id
            },
        }, 
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn:"1d"}
        );
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            accessToken
        });
    }
    else{
        res.status(401);
        throw new Error("Email or Password is not valid");
    }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser=asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports={registerUser,loginUser,currentUser};