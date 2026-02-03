import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';
let accessToken = '';
let refreshToken = '';
let cookies = '';

async function testLogin() {
  console.log('\n🔍 TEST 1: Login with student credentials');
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@college.edu', password: 'Test@1234' }),
      redirect: 'follow'
    });
    
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      console.log('✅ Set-Cookie header received:', setCookie.substring(0, 50) + '...');
      cookies = setCookie;
    }
    
    const data = await res.json();
    console.log('Status:', res.status);
    
    if (data.success) {
      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;
      console.log('✅ Login successful');
      console.log('   - AccessToken:', accessToken.substring(0, 30) + '...');
      console.log('   - RefreshToken:', refreshToken.substring(0, 30) + '...');
      console.log('   - User:', data.data.user.email, `(${data.data.user.userType})`);
    } else {
      console.error('❌ Login failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Login error:', err.message);
  }
}

async function testGetMe() {
  console.log('\n🔍 TEST 2: Get current user (/auth/me)');
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    
    if (data.success) {
      console.log('✅ Got current user:', data.data.email);
      console.log('   - Type:', data.data.userType);
      console.log('   - Profile:', data.data.profile.fullName);
    } else {
      console.error('❌ Get user failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Get user error:', err.message);
  }
}

async function testRefreshToken() {
  console.log('\n🔍 TEST 3: Refresh access token');
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    
    if (data.success) {
      const newAccessToken = data.data.accessToken;
      console.log('✅ Token refreshed successfully');
      console.log('   - New AccessToken:', newAccessToken.substring(0, 30) + '...');
      accessToken = newAccessToken;
    } else {
      console.error('❌ Token refresh failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Token refresh error:', err.message);
  }
}

async function testLogout() {
  console.log('\n🔍 TEST 4: Logout');
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': cookies
      },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    
    if (data.success) {
      console.log('✅ Logout successful');
    } else {
      console.error('❌ Logout failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Logout error:', err.message);
  }
}

async function testFacultyLogin() {
  console.log('\n🔍 TEST 5: Faculty login');
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'faculty@college.edu', password: 'Test@1234' })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    
    if (data.success) {
      console.log('✅ Faculty login successful');
      console.log('   - Email:', data.data.user.email);
      console.log('   - Type:', data.data.user.userType);
      console.log('   - Name:', data.data.user.profile.fullName);
    } else {
      console.error('❌ Faculty login failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Faculty login error:', err.message);
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════');
  console.log('Campus Echo - Backend Auth Tests');
  console.log('═══════════════════════════════════════');
  
  await testLogin();
  await testGetMe();
  await testRefreshToken();
  await testLogout();
  await testFacultyLogin();
  
  console.log('\n═══════════════════════════════════════');
  console.log('All tests completed');
  console.log('═══════════════════════════════════════\n');
  process.exit(0);
}

runAllTests();
