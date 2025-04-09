import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type:String,
    require:true
  },
  description: {
    type:String,
    require:true
  },
  requirements: [{
    type:String,
    require:true
  }],
  salary: {
    type:Number,
    require:true
  },
  experience: Number,
  location:{
    type:String,
    require:true

  },
  jobType:{
    type:String,
    require:true

  },
  position: {
    type:Number,
    require:true
  },
  company:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Company',
        require:true,
  },
  created_by:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'LoginModel',
        require:true,
  },
   applications:[
    {
    type : mongoose.Schema.Types.ObjectId,
    ref:'ApplicationModel',
    
}]
},{ timestamps: true });



const JobModel = mongoose.model("JobModel", jobSchema);
export default JobModel;
