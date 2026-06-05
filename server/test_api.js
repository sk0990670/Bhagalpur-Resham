const axios = require('axios');

async function testApi(url) {
  try {
    const res = await axios.get(url);
    console.log(`[${url}] Status:`, res.status);
    console.log(`[${url}] Data:`, JSON.stringify(res.data).substring(0, 200));
  } catch (err) {
    console.error(`[${url}] Error:`, err.response ? `${err.response.status} ${JSON.stringify(err.response.data)}` : err.message);
  }
}

async function run() {
  await testApi('https://bhagalpur-resham-api.vercel.app/api/health');
  await testApi('https://bhagalpur-resham-api.vercel.app/health');
  await testApi('https://bhagalpur-resham-api.vercel.app/');
}

run();
