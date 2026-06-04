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
        name: "Earthy Ghicha Handloom Saree",
        price: 12500,
        description: "Experience the raw elegance of Ghicha silk, beautifully handwoven by Bhagalpur artisans. Its coarse texture and natural earthen tones make it a timeless classic.",
        weaveType: "Ghicha Silk Weave",
        badge: "New Arrival",
        color: "Brown",
        images: [findImage('ghicha_main_'), findImage('ghicha_detail1_'), findImage('ghicha_detail2_')]
    },
    {
        name: "Elegant Matka Silk Masterpiece",
        price: 14200,
        description: "A luxurious Matka silk saree featuring a unique uneven texture and subtle sheen. Perfect for both casual and formal occasions.",
        weaveType: "Matka Silk Weave",
        badge: "Normal",
        color: "Beige",
        images: [findImage('matka_main_'), findImage('matka_detail1_'), findImage('matka_detail2_')]
    },
    {
        name: "Vibrant Dupion Silk Drape",
        price: 16800,
        description: "Stunning crisp Dupion silk with a dual-tone shimmering effect. A vibrant and majestic piece of handloom art.",
        weaveType: "Dupion Silk Weave",
        badge: "Best Seller",
        color: "Red",
        images: [findImage('dupion_main_'), findImage('dupion_detail1_'), findImage('dupion_detail2_')]
    },
    {
        name: "Everyday Cotton-Silk Bhagalpuri",
        price: 8500,
        description: "A breathable and soft blend of cotton and silk, offering unmatched comfort without compromising on traditional elegance.",
        weaveType: "Cotton-Silk Bhagalpuri Weave",
        badge: "Normal",
        color: "Off White",
        images: [findImage('cottonsilk_main_'), findImage('cottonsilk_detail1_'), findImage('matka_detail1_')]
    },
    {
        name: "Opulent Zari Bhagalpuri Saree",
        price: 24500,
        description: "A grand Bhagalpuri silk saree intricately woven with shimmering golden zari threads. A true statement piece for weddings and grand festivals.",
        weaveType: "Zari Bhagalpuri Weave",
        badge: "Best Seller",
        color: "Gold",
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
            
            const sku = 'TSS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            
            const payload = {
                name: productDef.name,
                sku: sku,
                stock: 15,
                price: productDef.price,
                description: productDef.description,
                weaveType: productDef.weaveType,
                weight: 500,
                isFeatured: productDef.badge === 'Best Seller',
                isActive: true,
                gstPercent: 5,
                attributes: {
                    color: productDef.color,
                    occasion: "Festive"
                },
                careInstructions: "Dry Clean Only",
                badge: productDef.badge,
                tempImageIds: uploadedTempIds
            };
            
            const createRes = await axios.post(`${API_URL}/products`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(`Successfully created ${productDef.name}`);
        }
        
        console.log('\nAll products added!');
        
    } catch (error) {
        console.error('Error adding product:', error.response?.data || error.message);
    }
}

addProducts();
