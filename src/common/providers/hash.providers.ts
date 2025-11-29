import { Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt'

@Injectable()
export class HashProvider{
    async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }

    async comparePassword(password: string,hashedPassword: string){
        return bcrypt.compare(password,hashedPassword)
    }
}