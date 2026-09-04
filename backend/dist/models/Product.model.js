"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductImageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, {
    _id: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    specifications: { type: String },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    diamondType: { type: String },
    metalType: { type: String },
    metalColor: { type: String },
    goldPurity: { type: String },
    diamondWeight: { type: String },
    diamondShape: { type: String },
    diamondQuality: { type: String },
    diamondColor: { type: String },
    diamondClarity: { type: String },
    stoneType: { type: String },
    certificate: { type: String },
    price: { type: Number },
    showPrice: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isSoldOut: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isHeroProduct: { type: Boolean, default: false },
    images: { type: [ProductImageSchema], default: [] },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            ret.id = ret._id.toString();
            // Expose categoryId as plain string ID if it's an ObjectId (not populated)
            if (ret.categoryId && typeof ret.categoryId === 'object' && (ret.categoryId._id || ret.categoryId.id)) {
                // populated: keep the category object but also expose its id
                ret.category = ret.categoryId;
                ret.categoryId = (ret.categoryId._id || ret.categoryId.id).toString();
            }
            else if (ret.categoryId) {
                ret.categoryId = ret.categoryId.toString();
            }
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Text index for search
ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });
exports.Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = exports.Product;
//# sourceMappingURL=Product.model.js.map