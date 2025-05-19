import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppointmentModule {} 