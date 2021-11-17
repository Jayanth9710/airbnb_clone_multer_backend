const router = require("express").Router();
const Room = require("../models/room")

//Creating new Pin.

router.post("/",async (req,res)=>{
    const newRoom = new Room(req.body);
    try {
        const savedRoom = await newRoom.save();
        res.status(200).json(savedRoom);
    } catch (err) {
        res.status(500).json(err)
    }
    
});

// Displaying all Pins.
router.get("/",async (req,res)=>{
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json(error)
    } 
})

module.exports = router