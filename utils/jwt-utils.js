import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()

export default class TokenUtilities{

    generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"24h"})
    }
    
    generateRefreshToken(user) {
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    }

    authenticateToken(req, res, next) {
        console.log(req)
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        console.log(token)
        if (token == null) return res.send(401)
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.send(403)
            req.user = user
            next()
        })
    }
}