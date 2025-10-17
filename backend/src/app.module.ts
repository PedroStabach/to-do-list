import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import {TasksModule} from  './tasks/tasks.module'
@Module({
  imports: [AuthModule, TasksModule], 
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
