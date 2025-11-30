import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProvidersModule } from 'src/common/providers/provider.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule,ProvidersModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule {}
