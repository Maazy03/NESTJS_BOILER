import * as jwt from 'jsonwebtoken'
import {jwtConstants} from './user.constants'
// import dotenv from 'dotenv'
const generateToken = (email) => {
    return  jwt.sign({ email }, jwtConstants.secret, {
        expiresIn: '30d'
    })
}

export default generateToken