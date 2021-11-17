'use strict';

const express = require('express');
const {upload} = require('../helpers/filehelper');
const { singleFileUpload,multipleFileUpload, getallSingleFiles, getallMultipleFiles,Addusers,GetUser,authenticate,RoomBook } = require('../controllers/fileuploaderController');
const router = express.Router();


router.post('/singleFile', upload.single('file'),singleFileUpload);
router.post('/multipleFiles',upload.array('files'),multipleFileUpload);
router.get('/getSingleFiles',getallSingleFiles);
router.get('/getMultipleFiles',getallMultipleFiles);
router.get('/roomsbkd/:id',[authenticate],RoomBook)
router.post('/register',Addusers);
router.post('/login',GetUser)

module.exports = {
    routes:router
}