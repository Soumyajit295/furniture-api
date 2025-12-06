import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProvidersModule } from 'src/common/providers/provider.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UsersModule,
        ProvidersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_ACCESS_SECRET'),
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,JwtStrategy],
    exports: []
})
export class AuthModule {}
