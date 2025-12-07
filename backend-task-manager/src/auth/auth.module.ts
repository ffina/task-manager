import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'; // Impor JwtModuleOptions
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRATION_TIME');

        // Menggunakan penegasan tipe (Type Assertion) pada objek yang dikembalikan
        return {
          secret: secret!,
          signOptions: { 
            // Menggunakan 'as string' di sini sudah cukup
            expiresIn: expiresIn! as string, 
          },
        } as JwtModuleOptions; // Menegaskan seluruh objek adalah JwtModuleOptions
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, AuthService, JwtModule],
})
export class AuthModule {}