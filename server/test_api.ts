import axios from 'axios';

async function run() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'sk0990670@gmail.com',
      password: '91Saymyname' // assuming this is the password from the screenshot
    });
    const token = loginRes.data.data.accessToken;

    console.log("Fetching products...");
    const prodRes = await axios.get('http://localhost:5000/api/products');
    const product = prodRes.data.data[0];
    console.log("Adding product to cart:", product._id);

    const cartRes = await axios.post('http://localhost:5000/api/cart/items', {
      productId: product._id,
      qty: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Cart Success:", cartRes.data);
  } catch (error: any) {
    if (error.response) {
      console.log("API Error:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }
  }
}
run();
