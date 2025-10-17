import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
