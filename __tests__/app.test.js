const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("get request tests", () => {
	describe("get /api/topics", () => {
		it("should return status 200 and an array of the topics", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body }) => {
					expect(body).toHaveProperty("slug");
					expect(body).toHaveProperty("description");
				});
		});
	});
});
