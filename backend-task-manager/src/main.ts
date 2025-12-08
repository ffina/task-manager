import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet'; // Instalasikan: npm install --save helmet

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

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

  // Proper CORS Configuration
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Add API prefix
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 Backend server running on http://localhost:3001');
  console.log('📝 API available at http://localhost:3001/api');
  console.log('📁 Static files served from /uploads');
}
bootstrap();
