const express = require("express");
const router = express.Router();
const multer = require("multer");
const { unlink } = require("fs").promises;
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
require("express-async-errors");

const upload = multer({ dest: "uploads/", fileFilter :  (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
})



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const singleImageUploadController = async (req, res) => {
  const filePath = req.file?.path;


  const cloudinaryPath = filePath
    ? await cloudinary.uploader.upload(filePath, { folder: "profile-picture" })
    : '';


    //delete files when created to the uploads folder 
  {
    filePath &&
     await unlink(filePath)
  }


  res
    .status(200)
    .json({
      status: true,
      message: cloudinaryPath ? "picture uploaded succesfully": "no picture uploaded",
      url: cloudinaryPath.secure_url || null,
    });
};

const manyImageUploadController = async(req,res)=>{
    const {files} = req


    const urls =[]

    files?.forEach(async (file)=>{
         const url = await (await cloudinary.uploader.upload(file.path)).secure_url
         urls.push(url) 
         await unlink(filr.path)
         
    })

      // const files= req.files
    // const cloudinaryPaths = files.map(async (file)=>{
    //     await cloudinary.uploader.upload(file.path,{folder:"media_url"}).secure_url
    // })


    res
    .status(200)
    .json({
      status: true,
      message: files ? "picture uploaded succesfully": "no picture uploaded",
      url: urlArray || null,
    });
}


router
  .route("/")
  .post(upload.single("profile-picture"), singleImageUploadController);
router
  .route('/many')
  .post(upload.array("pictures", 4), manyImageUploadController)
module.exports = router;
