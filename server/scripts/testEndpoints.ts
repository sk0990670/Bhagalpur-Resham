import axios from 'axios';

const run = async () => {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'sk0990670@gmail.com',
      password: '91Saymyname'
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('Got token:', token ? 'YES' : 'NO');
    
    const meRes = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Auth Me:', meRes.status);
    
    const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Get Profile:', profileRes.status);

    const productsRes = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Get Products:', productsRes.status);
    
  } catch (err: any) {
    console.error('Error:', err.response?.status, err.response?.data);
  }
};

run();
