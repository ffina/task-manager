import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      // Mengambil JWT dari header Authorization sebagai Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: configService.get('JWT_SECRET')!, // Kunci rahasia
      ignoreExpiration: false,
    });
  }

  // Payload adalah data yang dimasukkan ke dalam token saat login
  async validate(payload: { sub: number; email: string; role: string }): Promise<User> {
    const user = await this.authService.validateUser(payload.sub); 
    
    if (!user) {
      // Return appropriate HTTP status codes (401 Unauthorized)
      throw new UnauthorizedException('Token tidak valid atau user tidak ditemukan.');
    }
    
    // Objek user ini akan di-inject ke request (req.user)
    return user; 
  }
}