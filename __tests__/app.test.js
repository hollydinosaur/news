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
	describe("get /api/articles tests", () => {
		it("returns 200 and an array of article objects with the properties author(username from users), title, article_id, topic, created_at, votes, comment_count", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.forEach((object) => {
						expect(object).toHaveProperty("author");
						expect(object).toHaveProperty("title");
						expect(object).toHaveProperty("article_id");
						expect(object).toHaveProperty("topic");
						expect(object).toHaveProperty("created_at");
						expect(object).toHaveProperty("votes");
						expect(object).toHaveProperty("comment_count");
					});
				});
		});
		it("returns 200 and accepts sort by query of created_at, which is also the default, returns obj sorted by passed param", () => {
			return request(app)
				.get("/api/articles/?sort_by=created_at")
				.expect(200)
				.then(({ body }) => {
					expect(body).toBeSortedBy("created_at", { descending: true });
				});
		});
		it("returns 200 and accepts other valid sort by queries", () => {
			return request(app)
				.get("/api/articles/?sort_by=article_id")
				.expect(200)
				.then(({ body }) => {
					expect(body).toBeSortedBy("article_id", { descending: true });
				});
		});
		it("returns 200, allows the user to change whether the order is ascending or descending", () => {
			return request(app)
				.get("/api/articles/?sort_by=created_at&&order=ASC")
				.expect(200)
				.then(({ body }) => {
					expect(body).toBeSortedBy("created_at");
				});
		});
		it("returns 200, allows the user to pass through a topic and filters the articles by this topic, returning a filtered object", () => {
			return request(app)
				.get("/api/articles/?sort_by=created_at&&order=ASC&&topic=mitch")
				.expect(200)
				.then(({ body }) => {
					body.forEach((object) => {
						expect(object.topic).toBe("mitch");
					});
				});
		});
		it("should return 400 when passed a search query which does not exist", () => {
			return request(app)
				.get("/api/articles/?sort_by=notasortbyquery")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid sort by query");
				});
		});
		it("should return 400 when passed an order criteria which does not exist", () => {
			return request(app)
				.get("/api/articles/?order=notanorder")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid order query");
				});
		});
	});
});

describe("patch request tests", () => {
	describe("patch /api/articles/:article_id", () => {
		it("returns 201 and should accept an object and increment the amount of votes on the article with the given id (when the id is not a negative) using the value of the object. It should return the whole updated article", () => {
			return request(app)
				.patch("/api/articles/2")
				.send({ inc_votes: 10 })
				.expect(201)
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
		it("should return 201 and decrement the amount of votes on the article with the given id (when the id is a negative)", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: -10 })
				.expect(201)
				.then(({ body }) => {
					expect(body.article.votes).toBe(90);
				});
		});
		it("should return a 400 status code and a message saying invalid request when it is not sent an object", () => {
			return request(app)
				.patch("/api/articles/1")
				.send("not an object")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("should return a 400 bad request when the value passed is not a number, or the property is incorrectly labelled", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ not_correct: "hello" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
	});
});
