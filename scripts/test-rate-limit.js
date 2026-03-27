
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/business',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);

  if (res.headers['x-ratelimit-limit']) {
    console.log('✅ Rate limit headers found');
  } else {
    console.log('❌ No rate limit headers found');
  }
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
