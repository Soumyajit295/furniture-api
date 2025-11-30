import { IsEmail, IsNotEmpty, IsOptional, IsString, Min } from "class-validator"

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @Min(3,{message: "Name should be grater then 3 charecter"})
    name: string

    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    phone: string
}