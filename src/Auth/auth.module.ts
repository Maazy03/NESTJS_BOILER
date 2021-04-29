import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './auth.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
// import { StudentSchema } from 'src/models/student.schema';
// import { DriverSchema } from 'src/models/driver.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
    JwtModule.registerAsync({ 
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async(ConfigService:ConfigService)=>({
        secret:ConfigService.get('JWT_SECRET'),
        signOptions:{expiresIn:'30d'}
      })

    })
  ],
  controllers: [AuthController],
  providers: [AuthService,NodemailerService],
  exports:[AuthService]
})
export class AuthModule {}
