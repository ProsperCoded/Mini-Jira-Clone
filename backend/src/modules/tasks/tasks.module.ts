import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../utils/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
  exports: [TasksService],
})
export class TasksModule {}
