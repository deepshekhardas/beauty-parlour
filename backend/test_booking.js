
import http from 'http';

// Helper to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

console.log('--- Starting Backend API Test (ESM) ---');

try {
    // 1. Get Services
    console.log('\n1. Fetching Services...');
    const servicesRes = await makeRequest('/services');
    if (servicesRes.status !== 200 || servicesRes.data.length === 0) {
        throw new Error('Failed to fetch services or no services found');
    }
    const service = servicesRes.data[0];
    console.log(`   Success! Found Service: ${service.name} (ID: ${service._id})`);

    // 2. Get Staff
    console.log('\n2. Fetching Staff...');
    const staffRes = await makeRequest('/staff');
    let staffId = '';
    if (staffRes.status === 200 && staffRes.data.length > 0) {
        const staff = staffRes.data[0];
        staffId = staff._id;
        console.log(`   Success! Found Staff: ${staff.name} (ID: ${staffId})`);
    } else {
        console.log('   No staff found (optional).');
    }

    // 3. Create Appointment
    console.log('\n3. Creating Appointment...');
    const payload = {
        customer_name: "Backend Test User",
        customer_phone: "9988776655",
        service_id: service._id,
        staff_id: staffId, // Testing the fix specifically
        date: "2026-02-20",
        time_slot: "14:00-15:00",
        notes: "Direct API Test"
    };
    console.log('   Payload:', JSON.stringify(payload, null, 2));

    const bookingRes = await makeRequest('/appointments', 'POST', payload);

    if (bookingRes.status === 201) {
        console.log('\n✅ TEST PASSED: Appointment Created Successfully!');
        console.log('   Response:', bookingRes.data);
    } else {
        console.log('\n❌ TEST FAILED: Server returned error.');
        console.log('   Status:', bookingRes.status);
        console.log('   Error:', bookingRes.data);
    }

} catch (error) {
    console.error('\n❌ TEST CRASHED:', error.message);
}
