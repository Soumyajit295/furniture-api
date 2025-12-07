import { ProductStock } from "../products/enums/products.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Category } from "./category.entities";
import { ProductImage } from "./product-images.entities";


@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  material: string;

  @Column()
  brand: string;

  @Column()
  color: string;

  @Column()
  display_image: string;

  @Column({
    type: "enum",
    enum: ProductStock
  })
  status: ProductStock;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "CASCADE",  
  })
  @JoinColumn({ name: "categoryId" }) 
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];
}
