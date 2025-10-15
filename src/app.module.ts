import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomTypeModule } from './room-types/room-type.module';
// import { RoomAvailabilityModule } from './room-availability/room-availability.module';
import { AmenityModule } from './amenities/amenity.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RoomTypeModule,
    // RoomAvailabilityModule,
    AmenityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
