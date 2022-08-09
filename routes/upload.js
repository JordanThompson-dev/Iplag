var express = require('express');
var router = express.Router();
var {readFiles} = require("../services/file_reader");
var tokenizer = require("../services/core/tokenizer"); 
var htmlTokenizer = require("../services/core/htmlTokenizer"); 

var multer = require("multer");
var fs = require('fs-promise');
var Submissions = require("../models/files");

// Multer File upload settings
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files');
    },
    filename: (req, file, cb) => {
        const ext = `${file.originalname.substring(file.originalname.indexOf('.'))}`;
        const fileName = file.fieldname.toLowerCase().split(' ').join('-') + '-' + Date.now() + ext ;
        cb(null, fileName)
    }
});


var upload = multer({
    storage: storage,
});


router.post("/multiple",upload.array('file',5), async (req, res, next)=>{
  
    try{

        const ext = `${req.files[0].originalname.substring(req.files[0].originalname.indexOf('.'))}`;    

        fs.readFile(req.files[0].path, 'utf-8', async (err, data)=>{
            
            if(err){
                throw new Error("File Upload Error");
            }

            let tokens;
            if(ext === '.js'){
                tokens = tokenizer(data);
            }else{
                tokens = htmlTokenizer(data);
            }
            
            let filename = req.files[0].filename.substring(0, req.files[0].filename.indexOf('.'));
            filename = `${filename}.json`;

            fs.writeFile(`./public/tokens/${filename}`, JSON.stringify({tokens}), (err) =>{
                if(err){
                    throw new Error("File Tokenization Error");
                }
            } );

            await Submissions.updateOne({"_id": req.body.sub},{
                $push:{"files":{
                    'name': req.files[0].filename,
                    'originalname': req.files[0].originalname,
                    'ext': ext
                } }
            });
        })

        
    }
    catch(err){
        console.log(err)
        next(err);
    }

    res.send({success:true});
})

module.exports = router;