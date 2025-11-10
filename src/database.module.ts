import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { User } from './entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...AppDataSource.options, entities: [User] }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
