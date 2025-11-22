import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create restaurant owner
  const ownerPassword = await bcrypt.hash('Owner@123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@restaurant.com' },
    update: {},
    create: {
      email: 'owner@restaurant.com',
      password: ownerPassword,
      firstName: 'Restaurant',
      lastName: 'Owner',
      phone: '+92-300-1234567',
      role: 'RESTAURANT_OWNER',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Restaurant owner created:', owner.email);

  // Create customer
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@restaurant.com' },
    update: {},
    create: {
      email: 'customer@restaurant.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+92-300-9876543',
      role: 'CUSTOMER',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create a sample restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'spice-haven' },
    update: {},
    create: {
      name: 'Spice Haven',
      slug: 'spice-haven',
      description: 'Experience authentic Pakistani and Indian cuisine with a modern twist',
      phone: '+92-21-12345678',
      email: 'info@spicehaven.com',
      address: '123 Food Street, Karachi',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75500',
      country: 'Pakistan',
      cuisineType: ['Pakistani', 'Indian', 'Mughlai'],
      status: 'APPROVED',
      isActive: true,
      acceptsOrders: true,
      minOrderAmount: 500,
      deliveryFee: 150,
      taxRate: 0.16,
      businessHours: {
        monday: { open: '11:00', close: '23:00' },
        tuesday: { open: '11:00', close: '23:00' },
        wednesday: { open: '11:00', close: '23:00' },
        thursday: { open: '11:00', close: '23:00' },
        friday: { open: '11:00', close: '23:30' },
        saturday: { open: '11:00', close: '23:30' },
        sunday: { open: '11:00', close: '23:00' },
      },
      ownerId: owner.id,
    },
  });
  console.log('✅ Restaurant created:', restaurant.name);

  // Create categories
  const appetizersCategory = await prisma.category.create({
    data: {
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      sortOrder: 1,
      restaurantId: restaurant.id,
    },
  });

  const mainCourseCategory = await prisma.category.create({
    data: {
      name: 'Main Course',
      description: 'Traditional and modern main dishes',
      sortOrder: 2,
      restaurantId: restaurant.id,
    },
  });

  const dessertsCategory = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Sweet endings to your meal',
      sortOrder: 3,
      restaurantId: restaurant.id,
    },
  });

  const beveragesCategory = await prisma.category.create({
    data: {
      name: 'Beverages',
      description: 'Refreshing drinks and traditional beverages',
      sortOrder: 4,
      restaurantId: restaurant.id,
    },
  });

  console.log('✅ Categories created');

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Chicken Samosa',
        slug: 'chicken-samosa',
        description: 'Crispy pastry filled with spiced chicken and herbs',
        price: 150,
        categoryId: appetizersCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: false,
        spiceLevel: 2,
        prepTime: 15,
        calories: 250,
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Vegetable Pakora',
        slug: 'vegetable-pakora',
        description: 'Mixed vegetable fritters with mint chutney',
        price: 120,
        categoryId: appetizersCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: 2,
        prepTime: 12,
        calories: 180,
        isAvailable: true,
      },
      {
        name: 'Chicken Biryani',
        slug: 'chicken-biryani',
        description: 'Aromatic basmati rice with tender chicken and exotic spices',
        price: 550,
        categoryId: mainCourseCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: false,
        spiceLevel: 3,
        prepTime: 30,
        calories: 650,
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Mutton Karahi',
        slug: 'mutton-karahi',
        description: 'Traditional mutton curry cooked in a wok with tomatoes and spices',
        price: 850,
        categoryId: mainCourseCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: false,
        spiceLevel: 4,
        prepTime: 40,
        calories: 720,
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Palak Paneer',
        slug: 'palak-paneer',
        description: 'Cottage cheese cubes in creamy spinach gravy',
        price: 450,
        categoryId: mainCourseCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: true,
        spiceLevel: 2,
        prepTime: 25,
        calories: 420,
        isAvailable: true,
      },
      {
        name: 'Gulab Jamun',
        slug: 'gulab-jamun',
        description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
        price: 180,
        categoryId: dessertsCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: true,
        spiceLevel: 0,
        prepTime: 5,
        calories: 350,
        isAvailable: true,
      },
      {
        name: 'Kheer',
        slug: 'kheer',
        description: 'Traditional rice pudding with cardamom and nuts',
        price: 200,
        categoryId: dessertsCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: true,
        spiceLevel: 0,
        prepTime: 10,
        calories: 280,
        isAvailable: true,
      },
      {
        name: 'Mango Lassi',
        slug: 'mango-lassi',
        description: 'Creamy yogurt drink blended with fresh mangoes',
        price: 180,
        categoryId: beveragesCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: true,
        spiceLevel: 0,
        prepTime: 5,
        calories: 200,
        isAvailable: true,
        isFeatured: true,
      },
      {
        name: 'Mint Margarita',
        slug: 'mint-margarita',
        description: 'Refreshing lemon-mint mocktail',
        price: 150,
        categoryId: beveragesCategory.id,
        restaurantId: restaurant.id,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: 0,
        prepTime: 5,
        calories: 120,
        isAvailable: true,
      },
    ],
  });

  console.log('✅ Menu items created');

  // Create tables with QR codes
  for (let i = 1; i <= 10; i++) {
    await prisma.table.create({
      data: {
        tableNumber: `T${i.toString().padStart(2, '0')}`,
        capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
        qrCode: `QR-${restaurant.id}-T${i.toString().padStart(2, '0')}`,
        floor: i <= 5 ? 'Ground Floor' : 'First Floor',
        section: i <= 5 ? 'Main Hall' : 'VIP Section',
        restaurantId: restaurant.id,
      },
    });
  }

  console.log('✅ Tables created with QR codes');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@restaurant.com / Admin@123');
  console.log('Owner: owner@restaurant.com / Owner@123');
  console.log('Customer: customer@restaurant.com / Customer@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
