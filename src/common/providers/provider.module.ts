import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { HashProvider } from "./hash.providers";
import { TokenProvider } from "./token.providers";
import { CloudinaryService } from "./cloudinary.provider";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions: {
                expiresIn: Number(process.env.JWT_ACCESS_EXPIRATION as string) || 900,
            },
        })
    ],
    providers: [HashProvider,TokenProvider,CloudinaryService],
    exports: [HashProvider,TokenProvider,CloudinaryService]
})
export class ProvidersModule {}