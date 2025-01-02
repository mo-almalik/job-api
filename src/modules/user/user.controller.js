import { catchError, AppError } from "../../../utils/error.js"
import { User } from "../../models/user.js"
import fs from "fs"

// get my account 
export const getMyAccount = catchError(async (req, res) => {
    //  check if  account exists
    const user = await User.findById(req.user.id)
    if (!user) {
        throw new AppError("الحساب غير موجود", 404)
    }
    res.json({
        data: user
    })

})


// update my account
export const updateAccount = catchError(async (req, res) => {
    //  check if  account exists
    const user = await User.findById(req.user.id)
    if (!user) {
        throw new AppError("الحساب غير موجود", 404)
    }

    if(req.file){
        req.body.profileImage = req.file.path
        // remove old profile image
        if(user.profileImage){
            fs.unlinkSync(user.profileImage)
        }

    }
    if(req.body.email){
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser && existingUser._id.toString()!== req.user.id) {
            throw new AppError("البريد الالكتروني مستخدم", 409)
        }
    }

    const updateUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true})
   
    res.json({
        message:"تم تعديل البيانات بنجاح",
        data: updateUser
    })
    
})

// delete account
// TODO: remove this cv is exist 
export const deleteAccount = catchError(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return next(new AppError("الحساب غير موجود", 404))
    if(user.profileImage){
        fs.unlinkSync(user.profileImage)
    }
    res.status(200).json({
        message: "تم حذف الحساب بنجاح",
    });
})

// change password
export const changePassword = catchError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    const isMatch = bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!isMatch) return next(new AppError("كلمة المرور السايقة غير صحيحة", 409))
    user.password = req.body.password
    user.password = bcrypt.hashSync(user.password, +process.env.SALT);
    await user.save();
    res.status(200).json({
        message: "تم تغير كلمة المرور بنجاح",
    });
})