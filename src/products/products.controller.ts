import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService
    ){}
    @Post()
    @UseGuards(JwtAuthGuard)
     @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "display_image", maxCount: 1 },
        { name: "sub_images", maxCount: 5 },
      ],
      multerConfig
    )
  )
    public async AddProduct(
        @Body() createProductDto: CreateProductDto,
         @UploadedFiles()
            files: {
            display_image: Express.Multer.File[];
            sub_images?: Express.Multer.File[];
        },
    ){
        return await this.productService.addProduct(
            createProductDto,
            files.display_image[0],  
            files.sub_images || [],
        )
    }

    @Delete(':productId')
    public async deleteProduct(
      @Param('productId',new ParseUUIDPipe()) productId: string
    ){
      return await this.productService.deleteProduct(productId)
    }

    @Patch(':productId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'display_image',maxCount: 1},
          { name: 'sub_images', maxCount: 5}
        ],
        multerConfig
      )
    )
    public async updateProduct(
      @Param('productId', new ParseUUIDPipe()) productId: string,
      @Body() updateProductDto: UpdateProductDto,
      @UploadedFiles()
        file: {
          display_image?: Express.Multer.File,
          sub_images: Express.Multer.File[]
        }
    ){
      return await this.productService.updateProduct(productId,updateProductDto,file.display_image?.[0],file.sub_images || [])
    }

    @Get()
    public async getProducts(
      @Query('page') page = '1',
      @Query('limit') limit = '10'
    ){
      return await this.productService.getProducts(page,limit)
    }

    @Get(":productId")
    public async getProductDetails(
      @Param('productId',new ParseUUIDPipe()) productId: string
    ){
      return await this.productService.getProductDetails(productId)
    }

    @Get('category/:categoryId')
    public async getProductByCategory(
      @Param('categoryId',ParseIntPipe) categoryId: number,
      @Query('page',new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit',new DefaultValuePipe(10), ParseIntPipe) limit: number

    ){
      return await this.productService.getProductsByCategory(categoryId,page,limit)
    }
}
