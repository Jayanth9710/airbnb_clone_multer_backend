const router = require('express').Router();
const airbnb_user = require('../models/airbnb-users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


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


// Registering Users.

router.post("/register", async(req,res)=>{
    try {
        // Generating a secure Password.
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(req.body.password,salt);
        // Creating a new User.

         const newUser = new airbnb_user({
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
})

// Login.

router.post("/login", async(req,res)=>{
    try {
        // Finding User.
        const user = await airbnb_user.findOne({username:req.body.username});
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
})

       

module.exports = router;