import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService{
    constructor(private readonly configService: ConfigService){
        cloudinary.config({
            cloud_name: this.configService.get('CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_APIKEY'),
            api_secret: this.configService.get('CLOUDINARY_APISECRET'),
        })
    }
    async uploadImage(filePath: string,folder: string){
        return await cloudinary.uploader.upload(filePath,{folder})
    }

    async deleteImage(publicId: string){
        return await cloudinary.uploader.destroy(publicId)
    }
}