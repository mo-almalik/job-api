import { AppError, catchError } from "../../../utils/error.js";
import { User } from "../../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const Register = catchError(async(req,res)=>{
    if(req.body){
        req.body.password = bcrypt.hashSync(req.body.password , +process.env.SALT)
    }
    if(req.file){
        req.body.profileImage = req.file.path
      }
    await User.create(req.body)
    res.status(201).json({message: "تم انشاء الحساب بنجاح"})
})

export const Login = catchError(async(req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('-skills -experiences -education')
    if (!user || !bcrypt.compareSync(password ,user.password)){
        throw new AppError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 400)
    }
    const { role, _id: id, name } = user;
    const token = jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
      expiresIn:process.env.JWT_EXPIRES_IN,
    });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        secure: process.env.MODE === "production",
        sameSite: "Strict",
      });
      res.status(200).json({ message: "تم تسجيل الدخول بنجاح", data:user});
    

})