const request = require('supertest')
const app = require('../src/server.js')

describe('GET /plants', () => {
    it('should return status 200 and JSON list of plants', async () => {
        // Make the request
        const response = await request(app)
            .get('/plants')
            .expect('Content-Type', /json/) // making sure ir returns json
            .expect(200); // makes sure the status is 200
            // Make sure the request is an array (list)
        expect(Array.isArray(response.body)).toBe(true)

        // (optional) if the database is seeded (with dumpy or real info) verify the array contains expected object structure
        if(response.body.length > 0) {
            expect(typeof response.body[0]).toBe("object")
        }
    })
})
