const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET request tests", () => {
	describe("GET /api/topics", () => {
		it("returns status 200 and an array of the topics available on the database", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body }) => {
					expect(body.topics).toHaveLength(3);
					body.topics.forEach((object) => {
						expect(object).toHaveProperty("slug");
						expect(object).toHaveProperty("description");
					});
				});
		});
		it("returns 404 not found when passed an incorrect end point", () => {
			return request(app)
				.get("/api/notanendpoint")
				.expect(404)
				.then(({ body }) => {
					expect(body).toEqual({ msg: "Not found" });
				});
		});
	});
	describe("GET /api/articles/:article_id, getArticleById", () => {
		it("it takes an article id as a parameter and returns 200 and an object containing the article with the id, including author, title, article_id, topic, created_at, votes and comment count. comment_count should include a count of all the comments provided on the given article", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toBeInstanceOf(Object);
					expect(body.article).toHaveProperty("author");
					expect(body.article).toHaveProperty("title");
					expect(body.article).toHaveProperty("article_id");
					expect(body.article).toHaveProperty("topic");
					expect(body.article).toHaveProperty("created_at");
					expect(body.article).toHaveProperty("votes");
					expect(body.article).toHaveProperty("comment_count");
					expect(body.article.comment_count).toBe("11");
				});
		});
		it("returns 400 invalid request when passed a string instead of a number", () => {
			return request(app)
				.get("/api/articles/notanid")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 404 not found if passed a valid number, but it is not an article id", () => {
			return request(app)
				.get("/api/articles/50948")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
	});
	describe("get /api/articles tests, getAllArticles", () => {
		it("returns 200 and an array of article objects with the properties author, title, article_id, topic, created_at, votes, comment_count", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toHaveLength(10);
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
		it("returns 200 and accepts a sort by query of created_at, which is also the default. it returns an object sorted by the date it was created at in descending order", () => {
			return request(app)
				.get("/api/articles/?sort_by=created_at")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toBeSortedBy("created_at", {
						descending: true,
					});
				});
		});
		it("when passed another acceptable sort by query, it returns 200 and returns the object ordered in descending order by this query", () => {
			return request(app)
				.get("/api/articles/?sort_by=article_id")
				.expect(200)
				.then(({ body }) => {
					expect(body).toBeSortedBy("article_id", { descending: true });
				});
		});
		it("allows the user to change whether the order is ascending or descending and returns an object sorted in this order", () => {
			return request(app)
				.get("/api/articles/?sort_by=created_at&&order=ASC")
				.expect(200)
				.then(({ body }) => {
					expect(body).toBeSortedBy("created_at");
				});
		});
		it("allows the user to pass through a topic and filters the articles by this topic, returning 200 an object only containing articles about the given topic", () => {
			return request(app)
				.get("/api/articles/?sort_by=created_at&&order=ASC&&topic=mitch")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toHaveLength(10);
					body.articles.forEach((object) => {
						expect(object.topic).toBe("mitch");
					});
				});
		});
		it("returns 400 when passed a search query which does not exist", () => {
			return request(app)
				.get("/api/articles/?sort_by=notasortbyquery")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 400 when passed an order criteria which does not exist", () => {
			return request(app)
				.get("/api/articles/?order=notanorder")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 404 no such path when the topic value does not exist", () => {
			return request(app)
				.get("/api/articles/?topic=notattopic")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("returns 200 and an empty array when the given topic is valid, but there are no articles of the given topic", () => {
			return request(app)
				.get("/api/articles/?topic=paper")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles).toHaveLength(0);
				});
		});
		it("accepts a limit query, which allows the user to choose their own number of responses", () => {
			return request(app)
				.get("/api/articles?limit=4")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles.length).toBe(4);
				});
		});
		it("has a limit default of 10", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles.length).toBe(10);
				});
		});
		it("accepts a p query which specifies the page in which the user wishes to start at", () => {
			return request(app)
				.get("/api/articles/?p=2")
				.expect(200)
				.then(({ body }) => {
					expect(body.articles.length).toBe(2);
				});
		});
	});
	describe("GET /api/articles/:article_id/comments ", () => {
		it("returns status 200 and an array of comments about the article with the given id. the object has the properties comment id, votes, created at, author and body", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments).toHaveLength(11);
					body.comments.forEach((object) => {
						expect(object).toHaveProperty("created_at");
						expect(object).toHaveProperty("author");
						expect(object).toHaveProperty("body");
						expect(object).toHaveProperty("comment_id");
						expect(object).toHaveProperty("votes");
					});
				});
		});
		it("returns 200 and an empty array when the id is valid, but there are no comments for the article with that id", () => {
			return request(app)
				.get("/api/articles/2/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments).toHaveLength(0);
				});
		});

		it("returns 400 bad request when passed an id which is not a number", () => {
			return request(app)
				.get("/api/articles/notanumber/comments")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 200 and an empty array when the given article does not have any associated comments", () => {
			return request(app)
				.get("/api/articles/2/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments).toHaveLength(0);
				});
		});
		it("returns 404 bad path when passed an id which is a number but does not correspond with an article id", () => {
			return request(app)
				.get("/api/articles/294782/comments")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
	});
	describe("GET /api", () => {
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
		it("returns 404 when passed a path which does not exist", () => {
			return request(app)
				.get("/notanapi")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
	describe("GET /api/users", () => {
		it("responds with an array of objects and status 200. each object should at least have the property username", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body }) => {
					expect(body.users).toBeInstanceOf(Array);
					expect(body).toBeInstanceOf(Object);
					expect(body.users).toHaveLength(4);
					body.users.forEach((object) => {
						expect(object).toHaveProperty("username");
						expect(object).toHaveProperty("name");
						expect(object).toHaveProperty("avatar_url");
					});
				});
		});
		it("returns 404 when passed an invalid path", () => {
			return request(app)
				.get("/notapath")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
	describe("GET /api/users/:username", () => {
		it("accepts a username as a parameter and returns 200 and an object containing the details of the user with the given username", () => {
			return request(app)
				.get("/api/users/rogersop")
				.expect(200)
				.then(({ body }) => {
					expect(body.user.username).toBe("rogersop");
					expect(body.user.name).toBe("paul");
					expect(body.user).toHaveProperty("avatar_url");
				});
		});
		it("should return 404 when passed an invalid path", () => {
			return request(app)
				.get("/notapath")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		it("returns 404 not found when passed a username which does not exist", () => {
			return request(app)
				.get("/api/users/thisisnotausername")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
	});
	describe("GET /api/:username/comments", () => {
		it.only("returns status 200 and an array of the comments by the user", () => {
			return request(app)
				.get("/api/users/butter_bridge/comments")
				.expect(200)
				.then(({ body }) => {
					g;
					expect(body.comments).toHaveLength(5);
				});
		});
	});
});

describe("PATCH request tests", () => {
	describe("PATCH /api/articles/:article_id", () => {
		it("accepts an object with a key, the value of which indicates how the user would like to increment the amount of votes on the article with the given id using the value of the object. it returns 200 and the whole updated article", () => {
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
		it("it should also decrement the amount of votes on the article with the given id when the id is a negative, returning 200", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: -10 })
				.expect(200)
				.then(({ body }) => {
					expect(body.article.votes).toBe(90);
				});
		});
		it("returns a 400 status code and a message saying invalid request when it is not sent an object", () => {
			return request(app)
				.patch("/api/articles/1")
				.send("not an object")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns a 400 bad request when the value passed is not a number, or the property is incorrectly labelled", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ not_correct: "hello" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 404 bad request when the id passed is not a valid article id", () => {
			return request(app)
				.patch("/api/articles/193747")
				.send({ inc_votes: 40 })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("returns 400 bad request when the id passed is not a number", () => {
			return request(app)
				.patch("/api/articles/notanid")
				.send({ inc_votes: 40 })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
	});
	describe("PATCH /api/comments/:comment_id", () => {
		it("accepts a parameter of a comment id and an object in the form the value of  which will indicate how much the user would like to amend the comments votes by. returns a 200 and the updated comment", () => {
			return request(app)
				.patch("/api/comments/1")
				.send({ inc_votes: 10 })
				.expect(200)
				.then(({ body }) => {
					expect(body.comment.votes).toBe(26);
					expect(body.comment.article_id).toBe(9);
				});
		});
		it("returns 400 invalid request when not passed an object", () => {
			return request(app)
				.patch("/api/comments/1")
				.send("this is not an object")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 400 invalid request when passed an object with invalid parameters", () => {
			return request(app)
				.patch("/api/comments/1")
				.send({ thisisnotright: "this isn't either" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 400 when passed an id in the incorrect format", () => {
			return request(app)
				.patch("/api/comments/thisisnotright")
				.send({ inc_votes: 10 })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 404 invalid path when passed a valid number, but the number does not correspond to a correct id", () => {
			return request(app)
				.patch("/api/comments/47927497")
				.send({ inc_votes: 10 })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("should return 404 invalid path when passed an invalid path", () => {
			return request(app)
				.patch("/api/thisisnotcorrect")
				.send({ inc_votes: 10 })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
});

describe("POST request tests", () => {
	describe("POST /api/articles/:article_id/comments", () => {
		it("takes an article id as a parameter and an object, containing a username and body. it returns 201 and the posted comment", () => {
			return request(app)
				.post("/api/articles/2/comments")
				.send({ username: "rogersop", body: "here is my comment" })
				.expect(201)
				.then(({ body }) => {
					expect(body).toHaveProperty("body");
					expect(body).toHaveProperty("author");
				});
		});
		it("when passed a valid object, but with additional properties, it returns 201 and ignores unnecessary properties", () => {
			return request(app)
				.post("/api/articles/2/comments")
				.send({
					username: "rogersop",
					body: "here is my comment",
					hereis: "something",
					which: "is not necessary",
				})
				.expect(201)
				.then(({ body }) => {
					expect(body).toHaveProperty("body");
					expect(body).toHaveProperty("author");
				});
		});
		it("returns 404 when passed a username which does not exist", () => {
			return request(app)
				.post("/api/articles/2/comments")
				.send({ username: "notausername", body: "here is another comment" })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("returns 400 bad request when the id passed is not a number", () => {
			return request(app)
				.post("/api/articles/notanid/comments")
				.send({ username: "rogersop", body: "here is a third comment" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
		it("returns 404 and the id is a number, but there are no articles with that number", () => {
			return request(app)
				.post("/api/articles/47297392/comments")
				.send({ username: "rogersop", body: "here is a fourth comment" })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("returns 404 not found when passed a path which does not exist", () => {
			return request(app)
				.post("/api/thisdoesnotexist/4/comments")
				.send({ username: "rogersop", body: "here is a fourth comment" })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		it("returns 405 when path does exist but there is no post option", () => {
			return request(app)
				.post("/api/topics/")
				.send({ username: "rogersop", body: "here is a fourth comment" })
				.expect(405)
				.then(({ body }) => {
					expect(body.msg).toBe("Method not allowed");
				});
		});
		it("returns 404 when passed an object which does not have the correct properties", () => {
			return request(app)
				.post("/api/articles/2/comments")
				.send({
					notausername: "rogersop",
					notabody: "here is a fifth comment",
				})
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("returns 404 when not passed an object", () => {
			return request(app)
				.post("/api/articles/2/comments")
				.send("not an object")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
	});
});

describe("DELETE request tests", () => {
	describe("DELETE /api/comments/:comment_id", () => {
		it("takes a comment id as a parameter and returns 204, deleting the comment with the given id, without returning anything", () => {
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
		it("returns 404 when the passed id is a number but not a valid comment id", () => {
			return request(app)
				.delete("/api/comments/19857")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Path");
				});
		});
		it("when passed an invalid path, it returns 404 not found", () => {
			return request(app)
				.delete("/api/notapath/6")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		it("returns 405 when the passed path does exist, but there is no delete option for this path", () => {
			return request(app)
				.delete("/api/topics/")
				.expect(405)
				.then(({ body }) => {
					expect(body.msg).toBe("Method not allowed");
				});
		});
		it("returns 400 when passed an id which is not in the correct format", () => {
			return request(app)
				.delete("/api/comments/notanumber")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Invalid Request");
				});
		});
	});
});
