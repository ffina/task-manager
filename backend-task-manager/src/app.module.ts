import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
// Import modul lain di sini

@Module({
  imports: [
    // 1. Konfigurasi Lingkungan (Ambil dari .env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 2. Konfigurasi TypeORM (Database)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_NAME'), // task-manager.sqlite
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // HANYA gunakan true di development!
      }),
      inject: [ConfigService],
    }),

    // 3. Modul Otentikasi
    AuthModule,

    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}