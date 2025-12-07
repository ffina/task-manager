import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; // Instalasikan: npm install --save helmet

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 4. Security Best Practices
  // Menggunakan helmet untuk Headers Keamanan (XSS, Clickjacking, dll.)
  app.use(helmet());

  // Input Validation & Sanitization (melindungi dari XSS)
  // Menerapkan Validasi Global menggunakan DTOs (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Memberikan error jika ada properti asing
      transform: true, // Mengubah payload ke instance DTO
    }),
  );

  // Proper CORS Configuration (Ganti origin dengan alamat frontend-mu)
  app.enableCors({
    origin: 'http://localhost:5173', // Ganti dengan URL frontend-mu
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001); // Port default NestJS 3000, ubah agar tidak bentrok dengan frontend
}
bootstrap();