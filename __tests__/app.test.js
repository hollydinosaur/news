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
					body.topics.forEach((object) => {
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
					expect(body).toEqual({ msg: "Not found" });
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
	describe.only("get /api/articles tests", () => {
		it("returns 200 and an array of article objects with the properties author(username from users), title, article_id, topic, created_at, votes, comment_count", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((object) => {
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
					expect(body.articles).toBeSortedBy("created_at", {
						descending: true,
					});
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
					body.articles.forEach((object) => {
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
		it("should return 404 no such path when the topic value does not exist", () => {
			return request(app)
				.get("/api/articles/?topic=notattopic")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("No such path");
				});
		});
		it("should return 404 no topic data when there are no articles of the given topic", () => {
			return request(app)
				.get("/api/articles/?topic=paper")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("No such path");
				});
		});
	});
	describe("get /api/articles/:article_id/comments", () => {
		it("should return status 200, returning an array of comments for the article with the given id with the properties comment id, votes, created at, author and body", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(({ body }) => {
					body.comments.forEach((object) => {
						expect(object).toHaveProperty("created_at");
						expect(object).toHaveProperty("author");
						expect(object).toHaveProperty("body");
						expect(object).toHaveProperty("comment_id");
						expect(object).toHaveProperty("votes");
					});
				});
		});
		it("should return 400 bad request when passed an id which is not a number", () => {
			return request(app)
				.get("/api/articles/notanumber/comments")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("should return 404 no such path when the given article does not have any comments", () => {
			return request(app)
				.get("/api/articles/2/comments")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("No such path");
				});
		});
		it("should return 404 no such path when passed an id which does not exist", () => {
			return request(app)
				.get("/api/articles/294782/comments")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("No such path");
				});
		});
	});
	describe("get /api", () => {
		it("returns 200 and should return a JSON object with all the available endpoints", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					expect(body.endpoints["GET /api"]).toHaveProperty("description");
					expect(body.endpoints["GET /api/topics"]).toHaveProperty(
						"description"
					);
					expect(
						body.endpoints["DELETE /api/comments/:comment_id"]
					).toHaveProperty("description");
					expect(
						body.endpoints["GET /api/articles/:article_id/comments"]
					).toHaveProperty("exampleResponse");
					expect(body.endpoints["GET /api/articles"].queries).toBeInstanceOf(
						Array
					);
				});
		});
		it("should return 404 when passed a path which does not exist", () => {
			return request(app)
				.get("/notanapi")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
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

describe("post request tests", () => {
	describe("post /api/articles/:article_id/", () => {
		it("should return 201 and take an object with a username and body and return the posted comment", () => {
			return request(app)
				.post("/api/articles/2/")
				.send({ username: "rogersop", body: "here is my comment" })
				.expect(201)
				.then(({ body }) => {
					expect(body).toHaveProperty("body");
					expect(body).toHaveProperty("author");
				});
		});
		it("should return 400 when passed a username does not exist", () => {
			return request(app)
				.post("/api/articles/2/")
				.send({ username: "notausername", body: "here is another comment" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Username");
				});
		});
		it("should return 400 bad request when the id passed is not a number", () => {
			return request(app)
				.post("/api/articles/notanumber/")
				.send({ username: "rogersop", body: "here is a third comment" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid article ID");
				});
		});
		it("should return 400 and the id is a number but there are no articles with that number", () => {
			return request(app)
				.post("/api/articles/47297392/")
				.send({ username: "rogersop", body: "here is a fourth comment" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid article ID");
				});
		});
		it("should return 404 not found when passed a path which does not exist", () => {
			return request(app)
				.post("/api/thisdoesnotexist/4/")
				.send({ username: "rogersop", body: "here is a fourth comment" })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		it("should return 405 when path does exist but there is no delete option", () => {
			return request(app)
				.post("/api/topics/")
				.send({ username: "rogersop", body: "here is a fourth comment" })
				.expect(405)
				.then(({ body }) => {
					expect(body.msg).toBe("Method not allowed");
				});
		});
		it("should return 400 when passed an object which does not have the correct properties", () => {
			return request(app)
				.post("/api/articles/2/")
				.send({ notausername: "rogersop", notabody: "here is a fifth comment" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Username");
				});
		});
		it("should return 400 when not passed an object", () => {
			return request(app)
				.post("/api/articles/2/")
				.send("not an object")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Username");
				});
		});
	});
});

describe("delete request tests", () => {
	describe("delete /api/comments/:comment_id", () => {
		it("should return 204 and delete the comment with the given id, without returning anything", () => {
			return request(app)
				.delete("/api/comments/4")
				.expect(204)
				.then(({ body }) => {
					expect(body).toEqual({});
				})
				.then(() => {
					return request(app)
						.get("/api/comments/4")
						.expect(200)
						.then(({ body }) => {
							expect(body.comment.length).toBe(0);
						});
				});
		});
		it("should return 400 when the id is a number but not a comment id", () => {
			return request(app)
				.delete("/api/comments/19857")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
		it("should return 404 not found when passed an invalid path", () => {
			return request(app)
				.delete("/api/notapath/6")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		it("should return 405 when the path does exist, but there is no delete option", () => {
			return request(app)
				.delete("/api/topics/")
				.expect(405)
				.then(({ body }) => {
					expect(body.msg).toBe("Method not allowed");
				});
		});
		it("should return 400 when passed an id which is not in the correct format", () => {
			return request(app)
				.delete("/api/comments/notanumber")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
	});
});
