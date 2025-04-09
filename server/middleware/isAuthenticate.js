import jwt from "jsonwebtoken"


const isAuthenticate = (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if (!token){ 
            return res.status(400).json({ 
              message: "User not Authenticated",
              success:false
            });
      
          }
          const decode = jwt.verify(token,"your_secret_key");
          if (!decode){ 
            return res.status(401).json({ 
              message: "invalid token",
              success:false
            });
      
          }
          req.id = decode.userId;
          next();
        
    } catch (error) {
        console.log(error)
        
    }
}

export default isAuthenticate;