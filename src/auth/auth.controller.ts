import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    public async register(
        @Body() registerDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ){
        const {token, data} = await this.authService.register(registerDto)    
        res.cookie('jwt_token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, 
            maxAge: 15 * 60 * 1000, 
        });
        return {
            message: 'Registration successful',
            data,
        };
    }

    @Post('login')
    public async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ){
        const {token, data} = await this.authService.login(loginDto)
        res.cookie('jwt_token',token,{
            httpOnly: true,
            sameSite: 'strict',
            secure: false, 
            maxAge: 15 * 60 * 1000, 
        })
        return {
            message: 'Login Successfull',
            data
        }
    }
}
