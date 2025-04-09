import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LoginModel from "../model/loginSignup.js";


export const Signup = async (req, res) => {
    const { name, email,phoneNumber, password ,role} = req.body;
    
    try {
      if(!name || !email|| !phoneNumber || !password || !role ){
        return res.status(400).json({
           message: "Somthing is missing" ,
           success:false
          });
      }

      // Check if user already exists
      const existingUser = await LoginModel.findOne({ email });
      if (existingUser) return res.status(400).json({
         message: "User already exists with this email" ,
         success:false
        });
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new LoginModel({ name, email,phoneNumber, password: hashedPassword,role });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully"  ,success:true});
  
    } catch (error) {
      console.error("Signup Error:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };



// 🔹 Login Route
 export const Login= async (req, res) => {
  const { email, password,role } = req.body;
  try {

    if( !email|| !password || !role ){
      return res.status(400).json({
         message: "Somthing is missing" ,
         success:false
        });
    }

    
    let user = await LoginModel.findOne({ email });
    if (!user){ 
      return res.status(400).json({ 
        message: "User not found",
        success:false
      });

    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){ return res.status(400).json({
       message: "Invalid credentials",
       success:false 
      });
    }

    if(role !== user.role){return res.status(400).json({
      message: "Account does not exit eith current role",
      success:false 
     });

    };

    const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "7d" });

    
    user={
      _id:user._id,
      name:user.name,
      email:user.email,
      phoneNumber:user.phoneNumber,
      role:user.role,
      profile:user.profile,

    }


    return res.status(200).cookie("token" ,token ,{maxAge:1*24*60*60*1000 , httpsOnly:true ,sameSite:"strict"}).json({
      message: "Loggin successful",
      user,
      success:true
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// logout
export const logOut = async(req,res)=>{
  try {
    return res.status(200).cookie("token" , "" ,{maxAge:0}).json({
      message: "Logged out successful",
      success:true

    })
  } catch (error) {
    console.log(error)
    
  }

}
