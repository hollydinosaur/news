const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const { get } = require("superagent");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("get request tests", () => {
	describe("get /api/topics", () => {
		it("should return status 200 and an array of the topics", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body }) => {
					body.forEach((object) => {
						expect(object).toHaveProperty("slug");
						expect(object).toHaveProperty("description");
					});
				});
		});
		it("should return 404 not found when passed an unavailable end point", () => {
			return request(app)
				.get("/api/notanendpoint")
				.expect(404)
				.then(({ body }) => {
					expect(body).toEqual({ message: "Not found" });
				});
		});
	});
	describe("get /api/articles/:article_id", () => {
		it("should return 200 and an object containing the relevant article, including author, title, article id, body, topic, created at, votes and comment count. Comment count should include a count of all the comments provided on the article", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toHaveProperty("author");
					expect(body.article).toHaveProperty("title");
					expect(body.article).toHaveProperty("article_id");
					expect(body.article).toHaveProperty("body");
					expect(body.article).toHaveProperty("topic");
					expect(body.article).toHaveProperty("created_at");
					expect(body.article).toHaveProperty("votes");
					expect(body.article).toHaveProperty("comment_count");
					expect(body.article.comment_count).toBe("11");
				});
		});
		it("should return 400 invalid request when passed a string instead of a number", () => {
			return request(app)
				.get("/api/articles/notanid")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("should return 404 not found if passed a valid number which is not an article id", () => {
			return request(app)
				.get("/api/articles/50948")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Article ID not found");
				});
		});
	});
});

describe("patch request tests", () => {
	describe("patch /api/articles/:article_id", () => {
		it("should accept an object and increment the amount of votes on the article with the given id (when the id is not a negative) using the value of the object. It should return the whole updated article", () => {
			return request(app)
				.patch("/api/articles/2")
				.send({ inc_votes: 10 })
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toHaveProperty("article_id");
					expect(body.article).toHaveProperty("title");
					expect(body.article).toHaveProperty("body");
					expect(body.article).toHaveProperty("topic");
					expect(body.article).toHaveProperty("author");
					expect(body.article).toHaveProperty("created_at");
					expect(body.article.votes).toBe(10);
				});
		});
	});
});
