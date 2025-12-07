import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entities';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryService } from 'src/common/providers/cloudinary.provider';
import { ProductImage } from 'src/entities/product-images.entities';
import * as fs from "fs";

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
}
