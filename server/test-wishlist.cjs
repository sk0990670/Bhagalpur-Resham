require('dotenv').config({ path: '../server/.env' });
const mongoose = require('mongoose');
const { Wishlist } = require('../server/dist/models/wishlist.model.js');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Find any user
    const User = mongoose.model('User');
    const user = await User.findOne();
    if (!user) return console.log('No user found');
    
    // Find any product
    const Product = mongoose.model('Product');
    const product = await Product.findOne();
    if (!product) return console.log('No product found');
    
    console.log('Testing with User:', user._id, 'Product:', product._id);
    
    // Try addItem
    const result = await Wishlist.findOneAndUpdate(
      { user: user._id },
      { $addToSet: { items: { product: product._id, addedAt: new Date() } } },
      { new: true, upsert: true }
    ).exec();
    
    console.log('Wishlist after add:', JSON.stringify(result, null, 2));
    
  } catch(e) {
    console.log('Error:', e);
  } finally {
    mongoose.disconnect();
  }
})();
