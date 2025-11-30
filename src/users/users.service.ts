import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entities';
import { Repository } from 'typeorm';
import { HashProvider } from 'src/common/providers/hash.providers';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
        private readonly hashService: HashProvider
    ){}
    public async createuser(createUserDto: CreateUserDto){
        const {name, email, password, phone } = createUserDto

        try{
            const existingUser = await this.UserRepository.findOne({where: {email}})
            
            if(existingUser){
                throw new BadRequestException('User already registered')
            }
            const hashPassword = await this.hashService.hashPassword(password)
            let user = this.UserRepository.create({
                name,
                email,
                password: hashPassword,
                phone: phone ?? null
            })

            return await this.UserRepository.save(user)
        }
        catch(err: any){
            console.log("Error while creating user : ",err)
            throw new ConflictException('Failed to create user, Internal server error')
        }
    }

    public async findByEmail(email: string){
        return await this.UserRepository.findOne({where: {email}})
    }
}
