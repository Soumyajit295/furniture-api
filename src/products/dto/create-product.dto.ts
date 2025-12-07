import { IsEnum, IsNotEmpty, IsString, Max, Min } from "class-validator"
import { ProductStock } from "../enums/products.enum"

export class CreateProductDto{
    @IsNotEmpty()
    @IsString()
    categoryId: string

    @IsNotEmpty()
    @IsString()
    @Min(3,{message: 'Product name should be grater then 3'})
    name: string

    @IsNotEmpty()
    @Max(500,{message: 'Product description should be within 500 character'})
    description: string

    @IsNotEmpty()
    @IsString()
    material: string

    @IsNotEmpty()
    @IsString()
    brand: string

    @IsNotEmpty()
    @IsString()
    color: string

    @IsNotEmpty()
    @IsString()
    @IsEnum(ProductStock)
    status: ProductStock
}