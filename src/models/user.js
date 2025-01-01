import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 3,
        maxlength: 50
    },
    username: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'job_seeker' ,'employer'],
        default: 'job_seeker'
    },
    profileImage:{
        type: String
    },
    phone:{
        type: String
    },
    isVerifided:{
        type: Boolean,
        default: false
    },
    skills:[String],
    experiences:[
        {
            title: String,
            company: String,
            location: String,
            from: Date,
            to: Date,
            current: Boolean,
            description: String
        }
    ],
    education:[
        {
            institution: String,
            degree: String,
            fieldOfStudy: String,
            from: Date,
            to: Date,
            current: Boolean
        }
    ],
    location:{
        address: String,
        city: String,
        country: String,
    }

},{
    timestamps: true
})

export const User = mongoose.model('User',userSchema)