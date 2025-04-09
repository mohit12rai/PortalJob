import express from 'express'
import { Login, logOut, Signup, updateProfile } from '../controller/LoginController.js';
import isAuthenticate from '../middleware/isAuthenticate.js';

const LoginRouter=express.Router();

LoginRouter.post('/signup',Signup)

LoginRouter.post('/login',Login)
LoginRouter.post('/logout',logOut)
LoginRouter.post('/updateProfile',isAuthenticate,updateProfile)

export default LoginRouter