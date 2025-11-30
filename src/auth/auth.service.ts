import { BadRequestException, Body, ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TokenProvider } from 'src/common/providers/token.providers';
import { LoginDto } from './dto/login.dto';
import { HashProvider } from 'src/common/providers/hash.providers';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenProvider,
        private readonly hashService: HashProvider
    ){}
    public async register(registerDto: CreateUserDto){
        try{
            const user = await this.usersService.createuser(registerDto)
            if(!user){
                throw new ConflictException('Failed to register')
            }
            const token = await this.tokenService.signJwt(registerDto.email)
            return{
                token,
                message: 'User register successfully',
                data: user
            }
        }
        catch(err: any){
            console.log("Error while register : ",err)
            throw new ConflictException('Failed to register , Internal server error')
        }
    }

   public async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new BadRequestException('Email id is not registered');
        }

        const isSamePassword = await this.hashService.comparePassword(password, user.password);

        if (!isSamePassword) {
            throw new BadRequestException('Invalid Credentials');
        }

        const token = await this.tokenService.signJwt(email);

        return {
            token,
            message: 'Login Successful',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        };
    }

}
