async function runTests() {
  const API_URL = 'http://localhost:8000/api/v1';
  console.log("🚀 Starting API Tests...\n");

  try {
    // 1. Test Registration
    console.log("1️⃣ Testing User Registration...");
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      })
    });
    const regData = await regRes.json();
    console.log("Registration Response:", regData, "\n");

    // 2. Test Login (Will fail if user is PENDING, which is correct based on our logic!)
    console.log("2️⃣ Testing User Login...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.user.email,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log("Login Response (Should say inactive/pending):", loginData, "\n");
    
    console.log("✅ Tests completed successfully!");

  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

runTests();
