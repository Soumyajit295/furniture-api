import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entities';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly CategoriesRepository: Repository<Category>
    ){}
    public async createCategory(createCategoryDto: CreateCategoryDto){
        const {name,description} = createCategoryDto
        let category = this.CategoriesRepository.create({
            name,
            description
        })
        const response = await this.CategoriesRepository.save(category)
        if(!response){
            throw new BadRequestException('Failed to create the Category')
        }
        return{
            message: 'Category Created Successfully',
            data: response
        }
    }

    public async updateCategory(categoryId: number,updateCategory: UpdateCategoryDto){
        let category = await this.CategoriesRepository.findOne({where: {id: categoryId}})
        if(!category){
            throw new BadRequestException('Category not found')
        }   
        category.name = updateCategory?.name ?? category.name
        category.description = updateCategory?.description ?? category.description

        let response = await this.CategoriesRepository.save(category)
        if(!response){
         throw new ConflictException('Failed to update category')   
        }
        return{
            message: "Category Details update successfully",
            data: response
        }
    }

    public async getCategories(){
        try{
            return await this.CategoriesRepository.find()
        }
        catch(err: any){
            throw new ConflictException("Failed to fetch categories, Internal server error")
        }
    }

    public async deleteCategory(id: number){
        let category = await this.CategoriesRepository.findOne({where: {id}})
        if(!category){
            throw new BadRequestException('Category not found')
        }   
        try{
           await this.CategoriesRepository.delete(id)
           return {
             message: 'Category Deleted successfully'
           }
        }catch(err: any){
            throw new ConflictException('Failed to delete category, Internal server error')
        }
    }

    public async getCategoryById(id: number){
        return await this.CategoriesRepository.findOne({where: {id}})
    }
}
