import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        // whenever you want search a particular field in the database setting index to true will make the search faster
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
        // index: true should not be set as it is very expensive so use only on fields that are searched frequently
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary image url
        required: true
    },
    coverImage: {
        type: String, //cloudinary image url
        required: true
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"] //custom error message
    },
    refreshToken: {
        type: String
    },
},
{
    timestamps: true
}
);
userSchema.pre("save", async function(next)
{
    //hash the password before saving the user model but there is a problem that when we update any feild other than password then also the password will be hashed again so we need to check if the password is modified or not therefore if is used
    if(!this.isModified("password"))
    {
        next();
    }//if not changes in password then next otherwise hash the password and then next 
    this.password=bcrypt.hashSync(this.password,10);
    next();

} )

userSchema.methods.isPasswordCorrect=async function(password){
    return bcrypt.compareSync(password,this.password);
}// this function will be used to compare the password entered by the user with the password stored in the database
userSchema.methods.genrateAceessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}
userSchema.methods.genrateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
            //generally we dont add other informationn because it is refreshed frequently
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}
export const User=mongoose.model("User",userSchema);
 