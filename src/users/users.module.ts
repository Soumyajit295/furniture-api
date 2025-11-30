import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { ProvidersModule } from 'src/common/providers/provider.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ProvidersModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
