
import http from 'http';

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

console.log('--- TESTING API LOGIN ---');
const email = '2f1000863@ds.study.iitm.ac.in';
const password = 'password123';

console.log(`Attempting login for: ${email}`);

makeRequest('/users/login', 'POST', { email, password })
    .then(res => {
        if (res.status === 200) {
            console.log('✅ LOGIN SUCCESS!');
            console.log('Token received:', res.data.token ? 'YES' : 'NO');
            console.log('User:', res.data.email);
        } else {
            console.log(`❌ LOGIN FAILED (Status: ${res.status})`);
            console.log('Error:', res.data);
        }
    })
    .catch(err => console.error('Request failed:', err));
