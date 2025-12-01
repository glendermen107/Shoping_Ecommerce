import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../products/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    /**
     * Genera un slug a partir del nombre
     */
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
            .trim()
            .replace(/\s+/g, '-') // Reemplazar espacios con guiones
            .replace(/-+/g, '-'); // Eliminar guiones duplicados
    }

    /**
     * Crear una nueva categoría
     */
    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { name } = createCategoryDto;

        // Verificar si ya existe una categoría con ese nombre
        const existingCategory = await this.categoryRepository.findOne({
            where: { name },
        });

        if (existingCategory) {
            throw new ConflictException(
                `Category with name "${name}" already exists`,
            );
        }

        // Generar slug
        const slug = this.generateSlug(name);

        // Verificar si ya existe una categoría con ese slug
        const existingSlug = await this.categoryRepository.findOne({
            where: { slug },
        });

        if (existingSlug) {
            throw new ConflictException(
                `Category with slug "${slug}" already exists`,
            );
        }

        // Crear la categoría
        const category = this.categoryRepository.create({
            name,
            slug,
        });

        return this.categoryRepository.save(category);
    }

    /**
     * Obtener todas las categorías con conteo de productos
     */
    async findAll(): Promise<any[]> {
        const categories = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.products', 'product')
            .getMany();

        // Formatear respuesta con conteo de productos
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            productCount: category.products ? category.products.length : 0,
        }));
    }

    /**
     * Obtener una categoría por ID
     */
    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    /**
     * Actualizar una categoría
     */
    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        const category = await this.findOne(id);

        if (updateCategoryDto.name) {
            // Verificar si el nuevo nombre ya existe (excepto en esta categoría)
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name },
            });

            if (existingCategory && existingCategory.id !== id) {
                throw new ConflictException(
                    `Category with name "${updateCategoryDto.name}" already exists`,
                );
            }

            // Actualizar nombre y regenerar slug
            category.name = updateCategoryDto.name;
            category.slug = this.generateSlug(updateCategoryDto.name);

            // Verificar si el nuevo slug ya existe (excepto en esta categoría)
            const existingSlug = await this.categoryRepository.findOne({
                where: { slug: category.slug },
            });

            if (existingSlug && existingSlug.id !== id) {
                throw new ConflictException(
                    `Category with slug "${category.slug}" already exists`,
                );
            }
        }

        return this.categoryRepository.save(category);
    }

    /**
     * Eliminar una categoría
     * Los productos asociados tendrán category = null
     */
    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);

        // Actualizar productos para que no tengan categoría
        await this.productRepository
            .createQueryBuilder()
            .update(Product)
            .set({ category: null })
            .where('category_id = :id', { id })
            .execute();

        // Eliminar la categoría
        await this.categoryRepository.remove(category);
    }
}
