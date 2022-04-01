const router = require('express').Router();
const ipfsController= require('../controller/ipfs');
const multer= require('multer');
const path= require('path');
const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./images');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

const upload= multer({storage:storage});
//Controller routes

router.post('/upload',upload.single('file'),ipfsController.post);

router.get('/view',ipfsController.get);


module.exports = router;