import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ){}

    @Get()
    public async getCategories(){
        return await this.categoriesService.getCategories()
    }

    @Post()
    public async createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ){
        return await this.categoriesService.createCategory(createCategoryDto)
    }

    @Patch(':id')
    public async updateCategory(
        @Body() updateCategorydto: UpdateCategoryDto,
        @Param('id',ParseIntPipe) id: number
    ){
        return this.categoriesService.updateCategory(id,updateCategorydto)
    }

    @Delete(':id')
    public async deleteCategory(
        @Param('id',ParseIntPipe) id: number
    ){
        return await this.categoriesService.deleteCategory(id)
    }

}
