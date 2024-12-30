import { Module } from '@nestjs/common';
import { DatabaseService } from 'database/init-database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
