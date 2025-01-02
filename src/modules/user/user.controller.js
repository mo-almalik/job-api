import { catchError, AppError } from "../../../utils/error.js"
import { User } from "../../models/user.js"
import fs from "fs"

// get my account 
export const getMyAccount = catchError(async (req, res) => {
    //  check if  account exists
    const user = await User.findById(req.user.id)
    if (!user) {
        throw new AppError("your account does not exist", 404)
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
        throw new AppError("your account does not exist", 404)
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
            throw new AppError("This email already exists", 409)
        }
    }

    const updateUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true})
   
    res.json({
        data: updateUser
    })
    
})