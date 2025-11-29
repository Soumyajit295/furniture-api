import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenProvider {
    constructor(
        private readonly jwtService: JwtService
    ){}

    async signJwt(email: string){
        return this.jwtService.sign({email},{
            expiresIn: Number(process.env.JWT_ACCESS_EXPIRATION as any) || 900,
            secret: process.env.JWT_ACCESS_SECRET!,
        })
    }
}