import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'//fs is a core module in nodejs that allows us to work with the file system
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath){
            return null;
        }
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file is uploaded successfully
        console.log("File uploaded successfully on Cloudinary",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        //remove the locally saved temporary file as the upload operation got failed becuase it  can be a corrupted file
        return null;

    }
}

export {uploadOnCloudinary};