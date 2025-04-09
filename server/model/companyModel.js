import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
    name: { type: String, require:true },
    description: { type: String},
    website: {  type: String},
    location: { type: String},
    logo: { type: String,  }, 
    UserId: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoginModel"  ,require:true}] // Referencing JobModel
}, { timestamps: true });


const Company = mongoose.model("Company", companySchema);
export default Company;
