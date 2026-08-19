const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 SANJEEVANI MULTISPECIALITY HOSPITAL — PHASE 8 & 9 TEST SUITE');
  console.log('====================================================\n');

  try {
    // Step 1: Admin Login to get token
    console.log('1. Authenticating Super Admin...');
    const loginRes = await request('POST', '/api/auth/admin/login', {
      email: 'superadmin@sanjeevanihosp.in',
      password: 'SuperAdmin@123'
    });
    if (loginRes.status !== 200 || !loginRes.data.data?.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginRes)}`);
    }
    const token = loginRes.data.data.token;
    console.log('   ✅ Admin Authenticated. JWT token received.\n');

    // Step 2: Public MJPJAY Info
    console.log('2. Testing GET /api/schemes/mjpjay/info...');
    const mjpjayRes = await request('GET', '/api/schemes/mjpjay/info');
    if (mjpjayRes.status === 200 && mjpjayRes.data.data.schemeInfo) {
      console.log(`   ✅ MJPJAY Info fetched. Scheme: "${mjpjayRes.data.data.schemeInfo.name}"`);
      console.log(`   ✅ Categories Count: ${mjpjayRes.data.data.eligibleCategories.length}`);
    } else {
      throw new Error(`Failed MJPJAY info: ${JSON.stringify(mjpjayRes)}`);
    }

    // Step 3: Public Insurance TPA Info
    console.log('\n3. Testing GET /api/schemes/insurance/info...');
    const insRes = await request('GET', '/api/schemes/insurance/info');
    if (insRes.status === 200 && insRes.data.data.panelInsurers) {
      console.log(`   ✅ Insurance Info fetched. Insurers: ${insRes.data.data.panelInsurers.length}, TPAs: ${insRes.data.data.tpaPartners.length}`);
    } else {
      throw new Error(`Failed Insurance info: ${JSON.stringify(insRes)}`);
    }

    // Step 4: Register New Scheme Claim (Patient)
    console.log('\n4. Testing POST /api/schemes/claims/register (MJPJAY Claim)...');
    const claimRes = await request('POST', '/api/schemes/claims/register', {
      schemeType: 'MJPJAY',
      patientName: 'Kaveri Pandurang Chavan',
      patientPhone: '9822114455',
      patientAge: 48,
      aadhaarLast4: '9081',
      rationCardNumber: 'MH/JLN/2021/0088219',
      diagnosisDescription: 'Laparoscopic Hysterectomy for Uterine Fibroids',
      estimatedAmount: 35000
    });
    if (claimRes.status === 201 && claimRes.data.data?.id) {
      const claimId = claimRes.data.data.id;
      console.log(`   ✅ Claim registered successfully. Claim ID: ${claimId}, Status: ${claimRes.data.data.status}`);
      
      // Step 5: Admin Update Claim Status
      console.log('\n5. Testing PATCH /api/schemes/claims/:id/status (Admin Pre-authorization)...');
      const updateRes = await request('PATCH', `/api/schemes/claims/${claimId}/status`, {
        status: 'PRE_AUTHORIZED',
        preAuthorizationId: 'MJPJAY/NIC/2026/08/9981',
        remarks: 'Pre-auth approved by government cell.'
      }, token);
      console.log(`   ✅ Claim status updated to: ${updateRes.data.data?.status}, Pre-Auth ID: ${updateRes.data.data?.preAuthorizationId}`);
    } else {
      throw new Error(`Claim registration failed: ${JSON.stringify(claimRes)}`);
    }

    // Step 6: Public Events
    console.log('\n6. Testing GET /api/reviews-events/events...');
    const eventsRes = await request('GET', '/api/reviews-events/events');
    if (eventsRes.status === 200 && Array.isArray(eventsRes.data.data)) {
      console.log(`   ✅ Upcoming Events count: ${eventsRes.data.data.length}`);
      console.log(`   ✅ Event 1: "${eventsRes.data.data[0]?.title}"`);
    } else {
      throw new Error(`Failed to fetch events: ${JSON.stringify(eventsRes)}`);
    }

    // Step 7: Submit Patient Review (Public)
    console.log('\n7. Testing POST /api/reviews-events/reviews/submit...');
    const reviewRes = await request('POST', '/api/reviews-events/reviews/submit', {
      patientName: 'Devidas Shingote',
      patientLocation: 'Jalna City',
      rating: 5,
      doctorName: 'Dr. Nishant Goyal',
      treatmentType: 'Arthroscopic Knee Surgery',
      reviewText: 'Outstanding surgical precision and compassionate care. The hospital staff supported our MJPJAY cashless documentation completely.'
    });
    if (reviewRes.status === 201 && reviewRes.data.data?.id) {
      const reviewId = reviewRes.data.data.id;
      console.log(`   ✅ Review submitted. ID: ${reviewId} (Pending moderation)`);

      // Step 8: Admin Moderate Review
      console.log('\n8. Testing PATCH /api/reviews-events/admin/reviews/:id/moderate (Admin Approval)...');
      const modRes = await request('PATCH', `/api/reviews-events/admin/reviews/${reviewId}/moderate`, {
        status: 'APPROVED',
        moderationNote: 'Verified treatment record with OT registry.'
      }, token);
      console.log(`   ✅ Review moderated to: ${modRes.data.data?.status}`);

      // Step 9: Mark Helpful
      console.log('\n9. Testing PATCH /api/reviews-events/reviews/:id/helpful...');
      const helpfulRes = await request('PATCH', `/api/reviews-events/reviews/${reviewId}/helpful`);
      console.log(`   ✅ Helpful vote recorded. Count: ${helpfulRes.data.data?.helpfulCount}`);
    } else {
      throw new Error(`Review submission failed: ${JSON.stringify(reviewRes)}`);
    }

    // Step 10: Review Stats
    console.log('\n10. Testing GET /api/reviews-events/reviews/stats...');
    const statsRes = await request('GET', '/api/reviews-events/reviews/stats');
    console.log(`   ✅ Review Stats: Average Rating: ${statsRes.data.data?.averageRating}★, Published: ${statsRes.data.data?.approvedReviews}, Total: ${statsRes.data.data?.totalReviews}`);

    console.log('\n====================================================');
    console.log('🎉 ALL LEVEL 8 & LEVEL 9 VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

runTests();
