// ══════════════════════════════════════════════════════════════
// MongoDB Initialization Script
// Runs once when MongoDB container is first created
// Creates the app database and a dedicated user
// ══════════════════════════════════════════════════════════════

// Switch to admin to create user
db = db.getSiblingDB('admin');

// Create app-specific user with limited permissions
db.createUser({
  user: process.env.MONGO_APP_USER || 'bhagalpur_app',
  pwd:  process.env.MONGO_APP_PASSWORD || 'app_password_change_me',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE || 'bhagalpur_resham',
    },
  ],
});

// Switch to app database and create initial collections + indexes
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'bhagalpur_resham');

// Create collections (MongoDB creates them lazily, but explicit helps with validators)
const collections = [
  'users', 'products', 'categories', 'orders',
  'reviews', 'carts', 'wishlists', 'coupons',
  'cmscontents', 'banners',
];

collections.forEach((name) => {
  try {
    db.createCollection(name);
    print(`Created collection: ${name}`);
  } catch (e) {
    print(`Collection ${name} already exists`);
  }
});

// ── Essential indexes for cold start ─────────────────────────
// Users
db.users.createIndex({ email: 1 }, { unique: true, background: true });
db.users.createIndex({ role: 1, isActive: 1 }, { background: true });

// Products
db.products.createIndex({ slug: 1 }, { unique: true, background: true });
db.products.createIndex({ category: 1, isActive: 1, avgRating: -1 }, { background: true });
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' }, { background: true });

// Orders
db.orders.createIndex({ orderId: 1 }, { unique: true, background: true });
db.orders.createIndex({ user: 1, createdAt: -1 }, { background: true });
db.orders.createIndex({ status: 1, createdAt: -1 }, { background: true });

// Categories
db.categories.createIndex({ slug: 1 }, { unique: true, background: true });

// Reviews
db.reviews.createIndex({ user: 1, product: 1 }, { unique: true, background: true });
db.reviews.createIndex({ product: 1, status: 1, createdAt: -1 }, { background: true });

// Coupons
db.coupons.createIndex({ code: 1 }, { unique: true, background: true });
db.coupons.createIndex({ isActive: 1, validFrom: 1, validTo: 1 }, { background: true });

// CMS
db.cmscontents.createIndex({ slug: 1, type: 1 }, { unique: true, background: true });
db.cmscontents.createIndex({ type: 1, isPublished: 1, sortOrder: 1 }, { background: true });

// Banners
db.banners.createIndex({ placement: 1, isActive: 1, sortOrder: 1 }, { background: true });

print('✅ MongoDB initialization complete — bhagalpur_resham database ready');
