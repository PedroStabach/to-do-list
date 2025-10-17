import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.update(req.user.sub, Number(id), dto); // ✅ converte pra número
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.delete(req.user.sub, Number(id)); // ✅ converte pra número
  }

}
