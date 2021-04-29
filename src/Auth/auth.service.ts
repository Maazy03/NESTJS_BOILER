import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, of } from 'rxjs';
import { User } from './auth.model';
// const bcrypt = require('bcrypt')
import * as bcrypt from 'bcrypt';
import generateToken from './generateToken';
// import nodemailer from "nodemailer";
import { NodemailerService } from "../nodemailer/nodemailer.service"




@Injectable()
export class AuthService {

  constructor(
    @InjectModel('User') private readonly authModel: Model<User>,
    // @InjectModel('Student') private readonly studentModel: Model<Student>,
    // @InjectModel('Driver') private readonly driverModel: Model<Driver>,
    private readonly jwtService: JwtService,
    private readonly mailerService: NodemailerService

    // private readonly mailerService: MailerService
  ) { }




  /*************************** SIgn UP ***************************/
  async registerUser(name, email, password) {
    console.log('sssssssssss', name, email, password)
    try {

      const mail = this.mailerService.sendMailToContactUs({ name: "MAaz", message: "HELLO" })
      // var hash = await bcrypt.hashSync(password, 10);
      // console.log("hash", hash)
      // const newUser = new this.authModel({
      //   name,
      //   email,
      //   password: hash,
      // });
      // // const result = await newUser.save();
      // // console.log(result);
      // return await newUser.save();

    } catch (error) {
      throw (error)

    }

  }





  /*************************** Login ***************************/
  async loginUser(request) {
    console.log('sssssssssss', request.body)
    try {
      let email = request.body.email
      let password = request.body.password
      const user = await this.authModel.findOne({ email })
      console.log("user data", user)

      if (!user) {
        throw new HttpException('Invalid Email', HttpStatus.BAD_REQUEST)
      }

      else {

        if (!await bcrypt.compareSync(password, user.password)) {
          throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST)

        }

        else {
          console.log("login complete", user)
          console.log("Token", generateToken(user._id))

          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
          }
        }
        //   return null

        // return user
      }
    } catch (error) {
      console.log("ERRRR---", error)
      throw error

    }

  }


  /*************************** Verify Email ***************************/
  async verifyEmail(request) {
    console.log('sssssssssss', request.body)
    try {
      let email = request.body.email
      let user = await this.authModel.findOne({ email })
      console.log("user data", user)

      if (user) {
        throw new HttpException('Email Already Verified', HttpStatus.BAD_REQUEST)
      }

      let OTPCodeExpiry = new Date();
      let OTPCode = Math.floor(100000 + Math.random() * 900000);
      try {
        user = new this.authModel(
          {
            email,
            OTPCodeExpiry,
            OTPCode
          }

        );

        const mail = await this.mailerService.sendMailToContactUs({ to: email, subject: "REGISTARTION OTP", Otp: OTPCode })
        console.log("MAIL--->", mail)
        await user.save();
      }
      catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            msg: "OTP NOT SENT",
          },
          HttpStatus.BAD_REQUEST
        );
      }
      return user


    } catch (error) {
      console.log("ERRRR---", error)
      throw error

    }

  }
  async verifyOTP(request) {
    try {

      let { email } = request.body;
      let { OTPCode } = request.body;
      let currentTime = new Date();
      let userEmail = await this.authModel.findOne({ email })
      console.log("user data", userEmail)

      if (!userEmail) {
        throw new HttpException('Invalid Email', HttpStatus.BAD_REQUEST)
      }

      currentTime.setHours(currentTime.getHours() - 1);
      let user = await this.authModel.findOne({
        email,
        OTPCode,
        OTPCodeExpiry: { $gt: currentTime },
      })

      if (user) {
        let registered = await this.authModel.findOneAndUpdate(
          { email },
          { OTPCode: '' }

        );
        if (registered) {
          throw new HttpException(
            {
              status: HttpStatus.OK,
              msg: 'OTP Verified',
            },
            HttpStatus.OK
          );
        }
      }
      else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            msg: 'Invalid (or) expired OTP !',
          },
          HttpStatus.BAD_REQUEST
        );
      }
    }
    catch (err) {
      throw err

    }
  }
  async setPassword(request) {
    try {

      let { email } = request.body;
      let { password } = request.body;
      let user = await this.authModel.findOne({ email })
      if (!user) {
        throw new HttpException('Invalid Email', HttpStatus.BAD_REQUEST)
      }
      var hash = await bcrypt.hashSync(password, 10);

      let registeredUser = await this.authModel.findOneAndUpdate(
        { email },
        { password: hash }

      );
      if(registeredUser)
      {
        const currentUser=await this.authModel.findOne({email})

      throw new HttpException(
        {
          status: HttpStatus.OK,
          msg: "User Registered Succesfully",
          user: currentUser,
          token: generateToken(currentUser._id),
        },
        HttpStatus.OK
      );
      }
      else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: "User not found",
          },
          HttpStatus.BAD_REQUEST
        );
      }

    }
    catch (err) {
      throw err

    }
  }
}
