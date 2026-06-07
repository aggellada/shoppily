import { prisma } from "../src/lib/prisma";
import * as argon2 from "argon2";
import { ROLES } from "../src/lib/roles";

async function main() {
  console.log("🌱 Starting database seeding...");

  // ==========================================
  // 0. WIPE EXISTING DATA (Reverse relation order)
  // ==========================================
  console.log("🧹 Sweeping old data...");

  // Child tables go first
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.item.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.profile.deleteMany();

  // Parent table goes last
  await prisma.user.deleteMany();

  console.log("🧼 Database is clean!");

  // Hash the requested password using Argon2
  const hashedPassword = await argon2.hash("test123");

  // ==========================================
  // 1. CREATE THE BUYER ACCOUNT
  // ==========================================
  const buyerUser = await prisma.user.create({
    data: {
      firstName: "Bobby",
      lastName: "Buyer",
      username: "buyer",
      email: "buyer@shoppily.com",
      password: hashedPassword,
      profile: {
        create: {
          role: ROLES.BUYER,
          address: "123 Consumer Lane, Checkout City",
          phone: "555-010-1010",
        },
      },
    },
  });
  console.log(`✅ Created Buyer: ${buyerUser.username}`);

  // ==========================================
  // 2. CREATE THE SELLER ACCOUNT & SHOP
  // ==========================================
  const sellerUser = await prisma.user.create({
    data: {
      firstName: "Sally",
      lastName: "Seller",
      username: "seller",
      email: "seller@shoppily.com",
      password: hashedPassword,
      profile: {
        create: {
          role: ROLES.SELLER,
          address: "456 Merchant Blvd, Storefront City",
          phone: "555-020-2020",
          shop: {
            create: {
              name: "Shoppily Essentials",
              items: {
                create: [
                  {
                    name: "Premium Foam Cleanser",
                    description: "A gentle, hydrating foam cleanser perfect for daily skincare routines.",
                    price: 500.0,
                    image:
                      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Mechanical Keyboard",
                    description: "Wireless mechanical keyboard with tactile switches and RGB lighting.",
                    price: 3200.0,
                    image:
                      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Ergonomic Desk Chair",
                    description: "Adjustable lumbar support chair for long coding sessions.",
                    price: 4500.0,
                    image:
                      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Wireless Noise-Canceling Headphones",
                    description:
                      "Over-ear headphones with active noise cancellation and 30-hour battery life.",
                    price: 8500.0,
                    image:
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Minimalist Desk Lamp",
                    description: "LED desk lamp with adjustable color temperature and brightness.",
                    price: 1200.0,
                    image:
                      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Stainless Steel Water Bottle",
                    description: "Vacuum insulated water bottle keeps drinks cold for 24 hours.",
                    price: 800.0,
                    image:
                      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Organic Cotton T-Shirt",
                    description: "Premium basic t-shirt made from 100% organic cotton. Unisex fit.",
                    price: 600.0,
                    image:
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Yoga Mat with Alignment Lines",
                    description: "Non-slip, eco-friendly yoga mat perfect for home workouts.",
                    price: 1500.0,
                    image:
                      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Smart Fitness Watch",
                    description: "Tracks heart rate, sleep, and daily steps with a waterproof design.",
                    price: 5500.0,
                    image:
                      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Bluetooth Portable Speaker",
                    description: "Compact, waterproof speaker with 360-degree sound and deep bass.",
                    price: 2500.0,
                    image:
                      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Ceramic Coffee Mug",
                    description: "Handcrafted 12oz ceramic mug with a matte finish.",
                    price: 400.0,
                    image:
                      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Blue Light Blocking Glasses",
                    description: "Reduces eye strain from digital screens with a stylish frame.",
                    price: 950.0,
                    image:
                      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Genuine Leather Wallet",
                    description: "Slim bifold wallet with RFID blocking technology.",
                    price: 1800.0,
                    image:
                      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Adjustable Dumbbell Set",
                    description: "Space-saving adjustable dumbbells, from 5lbs to 52lbs per hand.",
                    price: 6000.0,
                    image:
                      "https://images.unsplash.com/photo-1638096336340-425eeff64f69?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Essential Oil Diffuser",
                    description: "Ultrasonic aromatherapy diffuser with ambient LED lighting.",
                    price: 1100.0,
                    image:
                      "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Bamboo Cutting Board",
                    description: "Extra-large, thick bamboo cutting board with juice grooves.",
                    price: 750.0,
                    image:
                      "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Desk Plant - Succulent",
                    description: "Low-maintenance artificial succulent in a modern geometric pot.",
                    price: 350.0,
                    image:
                      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Fast Charging Power Bank",
                    description: "10000mAh portable charger with USB-C power delivery.",
                    price: 1600.0,
                    image:
                      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Heavy Duty Canvas Tote",
                    description: "Durable, multi-purpose tote bag ideal for groceries or everyday carry.",
                    price: 300.0,
                    image:
                      "https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Wireless Gaming Mouse",
                    description: "Ultra-lightweight gaming mouse with precision optical sensor.",
                    price: 2800.0,
                    image:
                      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
                  },
                ],
              },
            },
          },
        },
      },
    },
  });
  console.log(`✅ Created Seller: ${sellerUser.username} with 20 items in shop`);

  console.log("🌲 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
