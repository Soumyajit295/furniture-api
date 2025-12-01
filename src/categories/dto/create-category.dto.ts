import { IsNotEmpty, IsString, Min } from "class-validator"

export class CreateCategoryDto{
    @IsString()
    @Min(3,{message: "Category must be 3 character long"})
    name: string

    @IsString()
    @IsNotEmpty()
    description: string
}