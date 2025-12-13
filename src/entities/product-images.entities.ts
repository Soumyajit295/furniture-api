import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entities";

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  image_url: string;

  @Column()
  public_url: string;

  @Column({ nullable: true })
  alt_text: string;

  @Column({ default: false })
  is_primary: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "productId" })
  product: Product;
}
