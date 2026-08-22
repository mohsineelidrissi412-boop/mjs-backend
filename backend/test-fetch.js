require('dotenv').config();
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

async function test() {
  console.log("Testing connection with key:", key.substring(0, 10) + "...");
  try {
    const res = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const body = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", body);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
