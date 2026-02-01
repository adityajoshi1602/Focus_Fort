// test-api.js
const API_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 STARTING BACKEND TESTS...\n');

  // --- TEST 1: Check Server Status ---
  try {
    const res = await fetch('http://localhost:5000/');
    const text = await res.text();
    console.log(res.ok ? '✅ Server is Running' : '❌ Server Error');
  } catch (e) {
    console.log('❌ Server is DOWN. Is "npm run dev" running?');
    return;
  }

  // --- TEST 2: Database Connection (Categories) ---
  try {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      console.log(`✅ Database Connected! Found ${data.length} categories.`);
    } else {
      console.log('❌ Database Error:', data.message);
    }
  } catch (e) {
    console.log('❌ Failed to fetch categories');
  }

  // --- TEST 3: Authentication (Signup) ---
  let token = null;
  const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
  
  try {
    console.log(`\nAttempting Signup with ${randomEmail}...`);
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Test User',
        email: randomEmail,
        password: 'password123',
        role: 'explorer' // Matching your schema
      })
    });
    
    const data = await res.json();
    
    if (res.ok && data.token) {
      console.log('✅ Signup Successful!');
      console.log('🔑 Received Token:', data.token.substring(0, 15) + '...');
      token = data.token;
    } else {
      console.log('❌ Signup Failed:', data.message || data);
    }
  } catch (e) {
    console.log('❌ Signup Request Error:', e.message);
  }

  // --- TEST 4: Protected Route (Get Profile) ---
  if (token) {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      
      if (res.ok && data.email === randomEmail) {
        console.log('✅ Protected Route Access Verified!');
        console.log(`👤 User Profile: ${data.full_name} (${data.role})`);
      } else {
        console.log('❌ Protected Route Failed:', data.message);
      }
    } catch (e) {
      console.log('❌ Protected Request Error');
    }
  } else {
    console.log('⚠️ Skipping Test 4 because Signup failed.');
  }
}

testBackend();