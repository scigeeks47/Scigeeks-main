import jwt from "jsonwebtoken";
export const generateToken = (
    userID: string,
    email:string,
    role:string,
) =>{
    return jwt.sign({
        userID,
        email,
        role,
    },process.env.JWT_SECRET!,
    {
        expiresIn: "7d",
    });
}