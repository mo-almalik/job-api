import { catchError, AppError } from "../../../utils/error.js"
import jwt from "jsonwebtoken"

// authentication middleware
export const authentication = (req, res, next) => {
    const token = req.cookies.token

    // if not found token 
    if (!token) {
        return next(new AppError('You are not authenticated', 401))
    }

    try {
        // jwt verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        throw new AppError(error.message, 498)
    }

}


// authenticate middleware
export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError('Forbidden', 403);
        }
        next();
    };
};
