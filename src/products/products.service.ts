import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entities';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryService } from 'src/common/providers/cloudinary.provider';
import { ProductImage } from 'src/entities/product-images.entities';
import * as fs from "fs";
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly ProductRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly ProductImageRepository: Repository<ProductImage>,
        private readonly categoryService: CategoriesService,
        private readonly cloudinaryService: CloudinaryService
    ){}
    public async addProduct(
        createProductDto: CreateProductDto,
        displayImage: Express.Multer.File,
        subImages: Express.Multer.File[],
    ) {
        try {
            if (!displayImage) {
                throw new BadRequestException("Display image is required");
            }

            const category = await this.categoryService.getCategoryById(
                Number(createProductDto.categoryId)
            );

            if (!category) {
                throw new BadRequestException("Category not found");
            }

            const displayUpload = await this.cloudinaryService.uploadImage(
                displayImage.path,
                "products/display",
            );

            if (!displayUpload?.secure_url) {
                throw new ConflictException("Display image upload failed");
            }

            let product = this.ProductRepository.create({
                ...createProductDto,
                display_image: displayUpload.secure_url,
                public_image_url: displayUpload.public_id
            });

            product = await this.ProductRepository.save(product);

            if (!product) {
                throw new ConflictException("Failed to add product");
            }

            // Upload sub images if present 

            if (subImages && subImages.length > 0) {
                const imagePromises = subImages.map(async (file) => {
                    const upload = await this.cloudinaryService.uploadImage(
                        file.path,
                        "products/sub-images",
                    );

                    return this.ProductImageRepository.create({
                        productId: product.id,
                        image_url: upload.secure_url,
                        public_url: upload.public_id,
                        is_primary: false,
                    });
                });

                const images = await Promise.all(imagePromises);
                await this.ProductImageRepository.save(images);
            }

            return {
                message: "Product Added Successfully",
                data: product,
            };
        } 
        finally {
            if (displayImage?.path && fs.existsSync(displayImage.path)) {
                fs.unlinkSync(displayImage.path);
            }

            subImages?.forEach((img) => {
                if (img.path && fs.existsSync(img.path)) {
                    fs.unlinkSync(img.path);
                }
            });
        }
    }

    public async deleteProduct(productId: string){
        const product = await this.ProductRepository.findOne({where: {id: productId}})
        if(!product){
            throw new BadRequestException('Product not found')
        }
        try{
            await this.ProductRepository.delete(productId)
            return{
                message: 'Product deleted successfully'
            }
        }catch(err: any){
            throw new ConflictException('Falied to delete product, Internal server error')
        }
    } 

    public async updateProduct(
        productId: string,
        updateProductDto: UpdateProductDto,
        displayImage: Express.Multer.File,
        subImages: Express.Multer.File[]
    ){
        let product = await this.ProductRepository.findOne({where: {id: productId}})

        if(!product){
            throw new BadRequestException('Product Not found')
        }

        let {deleted_product,...updateData} = updateProductDto
        Object.assign(product,updateData)

        if (deleted_product && !Array.isArray(deleted_product)) {
            deleted_product = [deleted_product];
        }

        // If user upload a new display image then delete the old one from DB and cloudinary and upload the new one and set the secure url and public_id

        if(displayImage){
            if(product.public_image_url){
                await this.cloudinaryService.deleteImage(product.public_image_url)
            }
            const uploadedDisplayImage = await this.cloudinaryService.uploadImage(displayImage.path,"products/display")
            if(!uploadedDisplayImage){
                throw new ConflictException('Failed to upload the display image')
            }
            product.display_image = uploadedDisplayImage.secure_url
            product.public_image_url = uploadedDisplayImage.public_id

            fs.unlinkSync(displayImage.path)
        }

        // If we have something in the deleted_product array then loop through the array and remove from database and delete from cloudinary

        // Deleted product except public_id of the image which is responsible to delete the image from cloudinary

        if(deleted_product && deleted_product?.length > 0){
            for(const image_id of deleted_product){
                await this.ProductImageRepository.delete({public_url: image_id.toString()})
                await this.cloudinaryService.deleteImage(image_id.toString())
            }
        }

        let existingSubImagesForTheProduct = await this.ProductImageRepository.count({where: {productId: product.id}})

        if(subImages && subImages.length > 0){
            if(existingSubImagesForTheProduct + subImages.length > 5){
                throw new BadRequestException('Prodcut should have maximum 5 sub images')
            }
            const imagePromise = subImages.map(async(image)=>{
                const upload = await this.cloudinaryService.uploadImage(image.path,"products/sub")
                return this.ProductImageRepository.create({
                    productId: product.id,
                    image_url: upload.secure_url,
                    public_url: upload.public_id,
                    is_primary: false,
                })
            })
            const images = await Promise.all(imagePromise)
            try{
                await this.ProductImageRepository.save(images)
            }catch(err: any){
                throw new ConflictException('Failed to upload the subimages')
            }
            try{
                await this.ProductRepository.save(product)
                for(const img of subImages){
                    fs.unlinkSync(img.path)
                }
                return{
                    message: 'Product Updated Successfully',
                    data: product
                }
            }catch(err: any){
                throw new ConflictException('Failed to update product, Internal server error')
            }
        }
    }

    public async getProducts(page: string,limit: string){
        const offset = (Number(page) - 1)*Number(limit)
        if(offset < 0){
            throw new BadRequestException('Offset should be positive')
        }
        const [data,total] = await this.ProductRepository.findAndCount({take: Number(limit),skip: offset})
        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            data,
        };
    }

    public async getProductDetails(productId: string){
        try{
            const product = await this.ProductRepository.findOne(
                {
                    where: {id: productId},
                    relations: {images: true}
                }        
            )
            return {
                data: product
            }
        } catch(err: any){
            throw new ConflictException('Failed to fetch product details')
        }
    }

    public async getProductsByCategory(categoryId: number,page: number,limit: number){
        try{
            const offset = (page - 1)*limit
            if(offset < 0){
                throw new BadRequestException('Offset must of positive')
            }
            const [data,total] = await this.ProductRepository.findAndCount(
                {
                    take: page,
                    skip: offset,
                    where: {categoryId: categoryId.toString()}
                }
            )
            return {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / Number(limit)),
                data,
            };

        } catch(err: any){
            throw new ConflictException('Failed to fetch products')
        }
    }
}
