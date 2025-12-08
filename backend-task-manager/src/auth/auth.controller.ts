import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. User Registration (POST /auth/register)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterUserDto): Promise<{ message: string }> {
    await this.authService.register(registerDto);
    return { message: 'Registrasi berhasil. Silakan login.' };
  }

  // 2. User Login (POST /auth/login)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  // Contoh rute yang dilindungi (Untuk uji coba)
  @UseGuards(JwtAuthGuard) // Protect routes/endpoints based on authentication status
  @Get('profile')
  getProfile(@Request() req): Omit<User, 'password'> {
    // req.user berisi objek user dari JwtStrategy, tanpa perlu password
    const user = req.user;
    // Hapus password secara manual untuk memastikan tidak bocor
    delete user.password;
    return user;
  }
}