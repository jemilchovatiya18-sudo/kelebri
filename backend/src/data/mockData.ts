import bcrypt from 'bcryptjs';

// Pre-hash the default password from README for the mock admin
const defaultPasswordHash = bcrypt.hashSync('Kelebri@Admin2024', 12);

export let admins = [
  {
    id: 'admin_1',
    email: 'admin@kelebri.com',
    passwordHash: defaultPasswordHash,
    name: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export let categories = [
  {
    id: 'cat_1',
    name: 'Engagement Rings',
    slug: 'engagement-rings',
    type: 'JEWELRY',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    publicId: 'sample_id',
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export let products = [
  {
    id: 'prod_1',
    name: 'Classic Solitaire Ring',
    slug: 'classic-solitaire-ring',
    sku: 'RNG-SOL-001',
    description: 'A beautiful classic solitaire ring.',
    specifications: '18k White Gold, 1 Carat Diamond',
    categoryId: 'cat_1',
    diamondType: 'NATURAL',
    metalType: 'WHITE_GOLD',
    metalColor: 'Silver',
    goldPurity: 'K18',
    diamondWeight: '1.00',
    diamondShape: 'Round',
    diamondQuality: 'Excellent',
    diamondColor: 'D',
    diamondClarity: 'VVS1',
    stoneType: 'Diamond',
    certificate: 'GIA',
    price: 4999.99,
    showPrice: true,
    isAvailable: true,
    isSoldOut: false,
    isBestSeller: true,
    isHeroProduct: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: 'img_1',
        productId: 'prod_1',
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        publicId: 'sample_id',
        isPrimary: true,
        sortOrder: 0,
        createdAt: new Date(),
      },
    ],
  },
];

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);
