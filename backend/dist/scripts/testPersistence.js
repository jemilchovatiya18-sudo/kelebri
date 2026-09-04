"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../lib/db");
const Product_model_1 = require("../models/Product.model");
const Category_model_1 = require("../models/Category.model");
const runTest = async () => {
    console.log('🧪 Step 1: Connecting to MongoDB...');
    await (0, db_1.connectDB)();
    if (mongoose_1.default.connection.readyState !== 1) {
        console.error('❌ MongoDB not connected! Check your MONGODB_URI or local MongoDB service.');
        process.exit(1);
    }
    // Ensure a category exists
    let cat = await Category_model_1.Category.findOne();
    if (!cat) {
        cat = await Category_model_1.Category.create({ name: 'Test Category', slug: 'test-cat', type: 'JEWELRY', sortOrder: 1 });
    }
    const testSku = 'PERSIST-TEST-' + Date.now();
    console.log(`\n🧪 Step 2: Creating new product with SKU: ${testSku}...`);
    const product = new Product_model_1.Product({
        name: 'Persistent Royal Diamond Ring',
        slug: 'persistent-royal-diamond-ring-' + Date.now(),
        sku: testSku,
        description: 'A test product to verify 100% permanent MongoDB persistence.',
        categoryId: cat._id,
        diamondType: 'NATURAL',
        metalType: 'WHITE_GOLD',
        price: 9999,
        showPrice: true,
        isAvailable: true,
        isBestSeller: true,
        images: [{ url: '/images/categories/rings.jpg', isPrimary: true, sortOrder: 0 }],
    });
    await product.save();
    const createdId = product._id.toString();
    console.log(`✅ Product created & saved to MongoDB! (ID: ${createdId})`);
    console.log('\n🧪 Step 3: Verifying product existence in MongoDB collection...');
    const found = await Product_model_1.Product.findById(createdId).populate('categoryId');
    if (found) {
        console.log(`✅ Verified in MongoDB! Found: ${found.name} (SKU: ${found.sku})`);
    }
    else {
        console.error('❌ Product NOT found in MongoDB after save!');
        process.exit(1);
    }
    console.log('\n🧪 Step 4: Simulating server restart (Disconnecting DB and Reconnecting)...');
    await mongoose_1.default.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    await (0, db_1.connectDB)();
    console.log('⚡ Reconnected to MongoDB after restart simulation.');
    const foundAfterRestart = await Product_model_1.Product.findById(createdId);
    if (foundAfterRestart) {
        console.log(`🎉 PERMANENCE VERIFIED! Product still exists in MongoDB after restart: ${foundAfterRestart.name}`);
    }
    else {
        console.error('❌ Product vanished after restart!');
        process.exit(1);
    }
    // Clean up test product
    await Product_model_1.Product.findByIdAndDelete(createdId);
    console.log(`🧹 Cleaned up test product (ID: ${createdId}).`);
    console.log('\n✨ ALL PERSISTENCE TESTS PASSED SUCCESSFULLY! ✨\n');
    await mongoose_1.default.disconnect();
    process.exit(0);
};
runTest().catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
//# sourceMappingURL=testPersistence.js.map