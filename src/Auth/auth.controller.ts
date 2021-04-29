import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from './auth.service'


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    async signin(
        @Body('name') name: String,
        @Body('email') email: String,
        @Body('password') password: String) {
        try {
            console.log("TRY SIGNIN")

            const authen = await this.authService.registerUser(name, email, password)
            console.log("AUTHEN", authen)

            return {
                message: "User Registered Succesfully",
                data: authen
            }
        }

        catch (err) {
            console.log("CATCH SIGNIN")
            throw err
        }
    }

    @Post('/login')
    async login(
        // @Body('name') name: String,
        // @Body('email') email: String,
        // @Body('password') password: String
        @Req() request: Request) {
        try {
            console.log("TRY SIGNIN")

            const authen = await this.authService.loginUser(request)
            console.log("LOGIN AUTHEN", authen)

            return {
                message: "User Logged In Succesfully",
                data: authen
            }
        }

        catch (err) {
            console.log("CATCH SIGNIN", err)
            throw err
            // return {
            //     err
            // }
        }
    }

    
    @Post('/verifyEmail')
    async verifyEmail(
        // @Body('name') name: String,
        // @Body('email') email: String,
        // @Body('password') password: String
        @Req() request: Request) {
        try {
            console.log("TRY VERIFY EMAIL")
            const authen = await this.authService.verifyEmail(request)
            console.log("LOGIN AUTHEN", authen)

            return authen
        }

        catch (err) {
            console.log("CATCH SIGNIN", err)
            throw err
            // return {
            //     err
            // }
        }
    }
    @Post('/verifyOTP')
    async verifyOTP(
         @Req() request: Request) {
        try {
            console.log("TRY VERIFY OTP")
            const authen = await this.authService.verifyOTP(request)
            console.log("LOGIN AUTHEN", authen)
            return authen
        }

        catch (err) {
            console.log("CATCH SIGNIN", err)
            throw err
        }
    }
    @Post('/setPassword')
    async setPassword(
         @Req() request: Request) {
        try {
            console.log("TRY VEROFY PASWORED")
            const authen = await this.authService.setPassword(request)
            console.log("LOGIN AUTHEN", authen)
            return authen
        }

        catch (err) {
            console.log("CATCH SIGNIN", err)
            throw err
        }
    }

    


    

       

    
           
}