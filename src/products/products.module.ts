import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entities';
import { ProvidersModule } from 'src/common/providers/provider.module';
import { ProductImage } from 'src/entities/product-images.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,ProductImage]),
    CategoriesModule,
    ProvidersModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
