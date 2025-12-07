import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // Secure Hashing
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 1. User Registration
  async register(registerDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerDto;
    
    // Cek apakah user sudah ada
    const exists = await this.usersRepository.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('Email sudah terdaftar.');
    }

    // Secure Hashing (minimal 10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword, // Store passwords using secure hashing
    });

    return this.usersRepository.save(newUser);
  }

  // 2. User Login (Validasi & Pembuatan JWT)
  async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Temukan user
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid.');
    }

    // Bandingkan password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Kredensial tidak valid.');
    }

    // Jika berhasil, buat Payload JWT
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role // Sertakan role untuk RBAC
    };

    // Generate access tokens upon successful login
    const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'), // token expiration
    });

    // Implementasi Refresh Token:
    // Jika kamu ingin mengimplementasikan Refresh Token, kamu perlu:
    // 1. Membuat dan menyimpan refresh token di DB
    // 2. Mengembalikannya bersama access token
    // 3. Membuat endpoint /auth/refresh
    
    return { accessToken };
  }
  
  // Method untuk digunakan oleh JwtStrategy
  async validateUser(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            // Seharusnya tidak terjadi jika dipanggil dari JwtStrategy yang sudah memvalidasi token
            // Tapi kita harus menangani kemungkinan TypeORM mengembalikan null
            throw new UnauthorizedException('Pengguna tidak ditemukan.');
        }

        return user;
    }
}