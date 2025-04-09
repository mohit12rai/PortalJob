import mongoose, { Schema } from "mongoose";

const LoginSchema = new Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true},
  password: { type: String, required: true },
  role: 
  { type: String,
    enum:[' Job Seeker','Job Provider'] ,
    required: true 
  },
  
  profile:{
    bio:{type :String},
    skillls:[{type:String}],
    resume:{type :String},
    resumeOriginalName:{type:String},
    company:{
      type : mongoose.Schema.Types.ObjectId,
      ref:'Company',
    },
    profilePhoto:{
      type :String,
      default:"",
    }

  }
  
},{ timestamps: true });

const LoginModel = mongoose.model("LoginModel", LoginSchema);
export default LoginModel;