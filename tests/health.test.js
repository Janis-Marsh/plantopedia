const request = require('supertest')
const app = require('../src/app.js')

it('GET /health return 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
})
