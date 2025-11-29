import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/models/roles.model';
import { Category } from '../products/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) { }

  async runSeed() {
    // Verificar si ya hay datos
    const userCount = await this.userRepository.count();
    const categoryCount = await this.categoryRepository.count();

    if (userCount > 0 || categoryCount > 0) {
      this.logger.log('Database is already seeded. Skipping...');
      return { message: 'Database already seeded', skipped: true };
    }

    this.logger.log('🌱 Starting database seeding...');

    try {
      // 1. Crear usuarios
      await this.seedUsers();

      // 2. Crear categorías
      const categories = await this.seedCategories();

      // 3. Crear productos
      await this.seedProducts(categories);

      this.logger.log('✅ Seeding complete!');
      return { message: 'Seeding complete', skipped: false };
    } catch (error) {
      this.logger.error('Error during seeding:', error);
      throw error;
    }
  }

  async clearDatabase() {
    this.logger.log('🗑️  Clearing database...');

    // Usar TRUNCATE CASCADE para eliminar todas las tablas y sus relaciones
    await this.orderItemRepository.query('TRUNCATE TABLE order_items CASCADE');
    await this.orderRepository.query('TRUNCATE TABLE orders CASCADE');
    await this.cartItemRepository.query('TRUNCATE TABLE cart_items CASCADE');
    await this.cartRepository.query('TRUNCATE TABLE carts CASCADE');
    await this.productRepository.query('TRUNCATE TABLE products CASCADE');
    await this.categoryRepository.query('TRUNCATE TABLE categories CASCADE');
    await this.userRepository.query('TRUNCATE TABLE users CASCADE');

    this.logger.log('✅ Database cleared!');
    return { message: 'Database cleared successfully' };
  }

  private async seedUsers() {
    this.logger.log('👤 Seeding users...');

    const admin = this.userRepository.create({
      email: 'admin@test.com',
      password: 'Admin123!', // La entidad se encarga de hashear esto
      roles: [Role.ADMIN, Role.USER],
    });

    const user = this.userRepository.create({
      email: 'user@test.com',
      password: 'User123!',
      roles: [Role.USER],
    });

    const user2 = this.userRepository.create({
      email: 'user2@test.com',
      password: 'User123!',
      roles: [Role.USER],
    });

    await this.userRepository.save([admin, user, user2]);
    this.logger.log('✓ Users created: admin@test.com, user@test.com, user2@test.com');
  }

  private async seedCategories(): Promise<Category[]> {
    this.logger.log('📁 Seeding categories...');

    const categoriesData = [
      { name: 'Electrónica', isFeatured: true },
      { name: 'Ropa', isFeatured: true },
      { name: 'Hogar', isFeatured: false },
      { name: 'Deportes', isFeatured: false },
      { name: 'Libros', isFeatured: false },
      { name: 'Juguetes', isFeatured: false },
    ];

    const categories: Category[] = [];
    for (const data of categoriesData) {
      const category = this.categoryRepository.create(data);
      const saved = await this.categoryRepository.save(category);
      categories.push(saved);
    }

    this.logger.log(`✓ Created ${categories.length} categories`);
    return categories;
  }

  private async seedProducts(categories: Category[]) {
    this.logger.log('📦 Seeding products...');

    const productsData: any[] = [
      // Electrónica
      {
        name: 'Laptop HP 15"',
        slug: 'laptop-hp-15',
        description: 'Laptop HP con procesador Intel Core i5, 8GB RAM, 256GB SSD',
        price: 599990,
        stock: 15,
        imageUrl: 'https://via.placeholder.com/300x300?text=Laptop+HP',
        category: categories[0],
        isFeatured: true,
        isOnSale: true,
        discountPercent: 15,
      },
      {
        name: 'Mouse Inalámbrico Logitech',
        slug: 'mouse-logitech-wireless',
        description: 'Mouse inalámbrico ergonómico con batería de larga duración',
        price: 29990,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Mouse',
        category: categories[0],
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Teclado Mecánico RGB',
        slug: 'teclado-mecanico-rgb',
        description: 'Teclado mecánico con iluminación RGB personalizable',
        price: 89990,
        stock: 25,
        imageUrl: 'https://via.placeholder.com/300x300?text=Teclado',
        category: categories[0],
        isFeatured: true,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Auriculares Bluetooth Sony',
        slug: 'auriculares-sony-bluetooth',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        price: 149990,
        stock: 30,
        imageUrl: 'https://via.placeholder.com/300x300?text=Auriculares',
        category: categories[0],
        isFeatured: false,
        isOnSale: true,
        discountPercent: 20,
      },

      // Ropa
      {
        name: 'Camiseta Básica Algodón',
        slug: 'camiseta-basica-algodon',
        description: 'Camiseta 100% algodón, disponible en varios colores',
        price: 19990,
        stock: 100,
        imageUrl: 'https://via.placeholder.com/300x300?text=Camiseta',
        category: categories[1],
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Jeans Slim Fit',
        slug: 'jeans-slim-fit',
        description: 'Jeans de corte slim fit, tela elástica y cómoda',
        price: 49990,
        stock: 60,
        imageUrl: 'https://via.placeholder.com/300x300?text=Jeans',
        category: categories[1],
        isFeatured: true,
        isOnSale: true,
        discountPercent: 25,
      },
      {
        name: 'Zapatillas Deportivas',
        slug: 'zapatillas-deportivas',
        description: 'Zapatillas deportivas para running y entrenamiento',
        price: 79990,
        stock: 40,
        imageUrl: 'https://via.placeholder.com/300x300?text=Zapatillas',
        category: categories[1],
        isFeatured: true,
        isOnSale: false,
        discountPercent: null,
      },

      // Hogar
      {
        name: 'Cafetera Eléctrica',
        slug: 'cafetera-electrica',
        description: 'Cafetera eléctrica programable de 12 tazas',
        price: 59990,
        stock: 20,
        imageUrl: 'https://via.placeholder.com/300x300?text=Cafetera',
        category: categories[2],
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Juego de Sábanas Queen',
        slug: 'sabanas-queen',
        description: 'Juego de sábanas de algodón egipcio, tamaño queen',
        price: 39990,
        stock: 35,
        imageUrl: 'https://via.placeholder.com/300x300?text=Sabanas',
        category: categories[2],
        isFeatured: false,
        isOnSale: true,
        discountPercent: 10,
      },

      // Deportes
      {
        name: 'Pelota de Fútbol Profesional',
        slug: 'pelota-futbol-profesional',
        description: 'Pelota de fútbol tamaño oficial, costura térmica',
        price: 34990,
        stock: 45,
        imageUrl: 'https://via.placeholder.com/300x300?text=Pelota',
        category: categories[3],
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Pesas Ajustables 20kg',
        slug: 'pesas-ajustables-20kg',
        description: 'Set de pesas ajustables de 5 a 20kg',
        price: 129990,
        stock: 15,
        imageUrl: 'https://via.placeholder.com/300x300?text=Pesas',
        category: categories[3],
        isFeatured: true,
        isOnSale: false,
        discountPercent: null,
      },

      // Libros
      {
        name: 'El Principito',
        slug: 'el-principito',
        description: 'Clásico de la literatura universal, edición ilustrada',
        price: 14990,
        stock: 80,
        imageUrl: 'https://via.placeholder.com/300x300?text=Libro',
        category: categories[4],
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Cien Años de Soledad',
        slug: 'cien-anos-soledad',
        description: 'Obra maestra de Gabriel García Márquez',
        price: 19990,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Libro',
        category: categories[4],
        isFeatured: false,
        isOnSale: true,
        discountPercent: 15,
      },

      // Juguetes
      {
        name: 'LEGO Set Ciudad',
        slug: 'lego-set-ciudad',
        description: 'Set de construcción LEGO con 500 piezas',
        price: 69990,
        stock: 25,
        imageUrl: 'https://via.placeholder.com/300x300?text=LEGO',
        category: categories[5],
        isFeatured: true,
        isOnSale: false,
        discountPercent: null,
      },
      {
        name: 'Muñeca Barbie Fashionista',
        slug: 'barbie-fashionista',
        description: 'Muñeca Barbie con accesorios de moda',
        price: 24990,
        stock: 40,
        imageUrl: 'https://via.placeholder.com/300x300?text=Barbie',
        category: categories[5],
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      },
    ];

    const products: Product[] = [];
    for (let i = 0; i < productsData.length; i++) {
      try {
        const data = productsData[i];
        this.logger.log(`Creating product ${i + 1}/${productsData.length}: ${data.name}`);
        const product = this.productRepository.create(data);
        const saved = await this.productRepository.save(product);
        products.push(saved);
      } catch (error) {
        this.logger.error(`Error creating product ${i + 1}:`, error.message);
        throw error;
      }
    }

    this.logger.log(`✓ Created ${products.length} products`);
  }
}