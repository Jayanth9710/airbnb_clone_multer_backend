const express = require('express')
const cors = require("cors")
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const {MongoClient} = require("mongodb")
const PORT = process.env.PORT || 8800
const userRoute = require('./routes/airbnb-users')
const roomRoute = require('./routes/rooms')
const path =require('path');
const crypto = require('crypto')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const fileRoutes = require('./routes/file-upload-routes')


require('./db')();


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors({
  origin:"*"
}))
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/api',fileRoutes.routes);






//Middleware
// app.use(bodyParser.json())
app.use(methodOverride('_method'))

//connecting MongoDb
//  const conn = mongoose.createConnection(process.env.MONGO_URL)

//Init gfs
let gfs;

// conn.once('open', ()=>{
//     //Init Stream
//      gfs = Grid(conn.db,mongoose.mongo);
//      gfs.collection('rooms');
// }) 

// //Create Storage engine
// const storage = new GridFsStorage({
//     url: process.env.MONGO_URL,
//     file: (req, file) => { 
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'rooms'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
//   const rooms = multer({ storage });

//   //POST room
//   app.post('/rooms',rooms.single('file'),(req,res)=>{
//     res.json({file:req.file})
    
//   })

// mongoose.connection.on('connected',()=>{
//     console.log("Mongoose Connected")
// })



app.use("/api/users",userRoute);
app.use("/api/rooms",roomRoute)

app.listen(PORT,() => {
    console.log("Backend server is running!" )
    console.log(`The app is running in ${PORT}`);
});