const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 129.99,
    category: "Electronics",
    stock: 50,
    brand: "TechSound",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        alt: "Wireless Bluetooth Headphones"
      }
    ],
    tags: ["wireless", "bluetooth", "headphones", "audio"],
    rating: { average: 4.5, count: 128 }
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable organic cotton t-shirt available in multiple colors. Sustainable and eco-friendly.",
    price: 24.99,
    category: "Clothing",
    stock: 100,
    brand: "EcoWear",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        alt: "Organic Cotton T-Shirt"
      }
    ],
    tags: ["organic", "cotton", "t-shirt", "sustainable"],
    rating: { average: 4.2, count: 89 }
  },
  {
    name: "JavaScript: The Complete Guide",
    description: "Comprehensive guide to modern JavaScript programming. Perfect for beginners and advanced developers.",
    price: 39.99,
    category: "Books",
    stock: 25,
    brand: "TechBooks",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        alt: "JavaScript Programming Book"
      }
    ],
    tags: ["javascript", "programming", "book", "education"],
    rating: { average: 4.8, count: 245 }
  },
  {
    name: "Smart Home Security Camera",
    description: "WiFi-enabled security camera with motion detection, night vision, and mobile app control.",
    price: 89.99,
    category: "Electronics",
    stock: 30,
    brand: "SecureHome",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
        alt: "Smart Security Camera"
      }
    ],
    tags: ["security", "camera", "smart home", "wifi"],
    rating: { average: 4.3, count: 67 }
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and fitness.",
    price: 34.99,
    category: "Sports",
    stock: 75,
    brand: "FitLife",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        alt: "Premium Yoga Mat"
      }
    ],
    tags: ["yoga", "fitness", "mat", "exercise"],
    rating: { average: 4.6, count: 156 }
  },
  {
    name: "Ceramic Plant Pot Set",
    description: "Beautiful set of 3 ceramic plant pots with drainage holes. Perfect for indoor plants.",
    price: 45.99,
    category: "Home & Garden",
    stock: 40,
    brand: "GreenThumb",
    images: [
      {
        url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
        alt: "Ceramic Plant Pot Set"
      }
    ],
    tags: ["plants", "pots", "ceramic", "home decor"],
    rating: { average: 4.4, count: 92 }
  },
  {
    name: "Natural Face Moisturizer",
    description: "Organic face moisturizer with hyaluronic acid and vitamin E. Suitable for all skin types.",
    price: 28.99,
    category: "Beauty",
    stock: 60,
    brand: "PureBeauty",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
        alt: "Natural Face Moisturizer"
      }
    ],
    tags: ["skincare", "moisturizer", "organic", "beauty"],
    rating: { average: 4.7, count: 203 }
  },
  {
    name: "Educational Building Blocks",
    description: "Colorful building blocks set for kids aged 3-8. Promotes creativity and motor skills development.",
    price: 19.99,
    category: "Toys",
    stock: 80,
    brand: "KidsPlay",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558877385-626e39e8b6d0?w=400",
        alt: "Educational Building Blocks"
      }
    ],
    tags: ["toys", "blocks", "educational", "kids"],
    rating: { average: 4.5, count: 134 }
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products successfully`);

    // Display seeded products
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();