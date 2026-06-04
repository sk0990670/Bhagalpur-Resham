const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'sk0990670@gmail.com';
const ADMIN_PASSWORD = '91Saymyname';

const dir = 'C:\\Users\\solos\\.gemini\\antigravity-ide\\brain\\4eba07e0-0d58-4207-b263-7e6855187748\\';

const findImage = (prefix) => {
    const files = fs.readdirSync(dir);
    const file = files.find(f => f.startsWith(prefix) && f.endsWith('.png'));
    return file ? dir + file : null;
};

const productsToCreate = [
    {
        name: "Majestic Zari Bhagalpuri Saree",
        price: 27500,
        description: "An absolutely stunning handwoven Bhagalpuri silk saree featuring intricate metallic Zari borders. Perfect for making a grand entrance at any wedding or celebration.",
        weaveType: "Zari Bhagalpuri Weave",
        badge: "New Arrival",
        color: "Red",
        images: [findImage('dupion_main_'), findImage('ghicha_detail2_'), findImage('pure_tussar_border_')]
    }
];

async function addProducts() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        
        const token = loginRes.data.data.accessToken;
        console.log('Logged in successfully.');
        
        for (const productDef of productsToCreate) {
            console.log(`\n--- Adding Product: ${productDef.name} ---`);
            const uploadedTempIds = [];
            for (const imgPath of productDef.images) {
                if (!imgPath) {
                    console.log('MISSING IMAGE FOR', productDef.name);
                    continue;
                }
                const formData = new FormData();
                formData.append('image', fs.createReadStream(imgPath));
                
                const uploadRes = await axios.post(`${API_URL}/upload/temp`, formData, {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Bearer ${token}`
                    }
                });
                uploadedTempIds.push(uploadRes.data.data.tempId);
            }
            
            const sku = 'ZARI-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            
            const payload = {
                name: productDef.name,
                sku: sku,
                stock: 12,
                price: productDef.price,
                description: productDef.description,
                weaveType: productDef.weaveType,
                weight: 650,
                isFeatured: true,
                isActive: true,
                gstPercent: 5,
                attributes: {
                    color: productDef.color,
                    occasion: 'Wedding'
                },
                careInstructions: "Dry clean only to maintain the luster of the Zari.",
                badge: productDef.badge,
                tempImageIds: uploadedTempIds
            };
            
            console.log(`Sending create product request for ${productDef.name}...`);
            const res = await axios.post(`${API_URL}/products`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Success! Product created with status: ${res.data.status}`);
        }
        console.log('\nAll done!');
    } catch (err) {
        console.error('Error adding products:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
    }
}

addProducts();
