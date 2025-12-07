import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entities";

@Entity('category')
export class Category{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
    
    @CreateDateColumn()
    created_at: string

    @UpdateDateColumn()
    updated_at: string

}