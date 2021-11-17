'use strict'
const SingleFile = require('../models/singlefile');
const MultipleFile = require('../models/multiplefile');
const BookedRooms = require('../models/bookedRoom')
const AddUsers = require('../models/airbnb-users');
const bcrypt = require('bcrypt');
const mongodb = require("mongodb");
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();
//JSON Web Token

function authenticate(req, res, next) {
    try {
    // Check if the token is present
    // if present -> check if it is valid
    if(req.headers.authorization){
        jwt.verify(req.headers.authorization,process.env.JWT_SECRET,function(error,decoded){
            if(error){
                res.status(500).json({
                    message: "Unauthorized"
                })
            }else{
                console.log(decoded)
                req.userid = decoded.id;
            next()
            }
            
        });
      
    }else{
        res.status(401).json({
            message: "No Token Present"
        })
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
    
}

const Addusers = async(req,res)=>{
    try {
        // Generating a secure Password.
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(req.body.password,salt);
        // Creating a new User.

         const newUser = new AddUsers({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
         })
        // Save user and send Response.

        const user = await newUser.save();
        res.status(200).json({message:'User Registered',id:user._id})
    } catch (error) {
        res.status(500).json(error);
    }
}

const GetUser = async(req,res)=>{
    try {
        // Finding User.
        const user = await AddUsers.findOne({username:req.body.username});
        if (user) {
            // Hash the incoming password
            // Compare that password with user's password
            console.log(req.body)
            console.log(user.password)
            let matchPassword = bcrypt.compareSync(req.body.password, user.password)
            if (matchPassword) {
                // Generate JWT token
                let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
                res.json({
                    message: true,
                    token
                })
            } else {
                res.status(404).json({
                    message: "Username/Password is incorrect"
                })
            }
            // if both are correct then allow them
        } else {
            res.status(404).json({
                message: "Username/Password is incorrect"
            })
        }





    } catch (error) {
        console.log(error)
    }
}

const RoomBook = async (req,res,next) => {
    try {
        
        const rooms =  await MultipleFile.findById({_id:mongodb.ObjectId(req.params.id)})
        res.status(200).send(rooms);
        res.json(rooms);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const singleFileUpload = async (req,res,next) => {
    try {
        const file = new SingleFile({
            fileName:req.file.originalname,
            filePath:req.file.path,
            fileType:req.file.mimetype,
            fileSize:fileSizeFormatter(req.file.size,2) 
        });
        await file.save();
        res.status(201).send('File Uploaded Successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const multipleFileUpload = async (req,res,next) => {
    try {
        let filesArray = [];
        req.files.forEach(e => {
            const file = {
                fileName:e.originalname,
                filePath:e.path,
                fileType:e.mimetype,
                fileSize:fileSizeFormatter(e.size,2)
            }
            filesArray.push(file);
        });
        const multipleFiles = new MultipleFile({
            hotelname: req.body.hotelname,
            location: req.body.location,
            desc: req.body.desc,
            rating: req.body.rating,
            price:req.body.price,
            files: filesArray
        });
        await multipleFiles.save();
        res.status(201).send('Files Uploaded Successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getallSingleFiles = async(req,res,next) => {
    try {
        const files = await  SingleFile.find();
        res.status(200).send(files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getallMultipleFiles =  async(req,res,next) => {
    try {
        const files = await  MultipleFile.find({userid : req.userid});
        res.status(200).send(files);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const fileSizeFormatter = (bytes,decimal) => {
    if(bytes ===0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes','KB','MB','GB','TB','PB','EB','YB','ZB'];
    const index = Math.floor(Math.log(bytes)/Math.log(1000));
    return parseFloat((bytes/Math.pow(1000,index)).toFixed(dm)) + ' ' + sizes[index];
}

module.exports = {
    singleFileUpload,
    multipleFileUpload,
    getallSingleFiles,
    getallMultipleFiles,
    Addusers,
    GetUser,
    authenticate,
    RoomBook
}