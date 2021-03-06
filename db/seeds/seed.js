const format = require("pg-format");
const { query } = require("../connection.js");
const db = require("../connection.js");
const { createReferenceObj, formatArray } = require("../../utils");

const seed = (data) => {
	const { articleData, commentData, topicData, userData } = data;
	return db
		.query(`DROP TABLE IF EXISTS comments;`)
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS articles`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS users`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS topics`);
		})
		.then(() => {
			return db.query(`CREATE TABLE topics (
        slug VARCHAR(100) PRIMARY KEY NOT NULL, 
        description VARCHAR(100)
        )`);
		})
		.then(() => {
			return db.query(`CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY NOT NULL,
        avatar_url VARCHAR(250),
        name VARCHAR(75) NOT NULL
      );`);
		})
		.then(() => {
			return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY NOT NULL, 
      title VARCHAR(200) NOT NULL,
      body TEXT, 
      votes INT, 
      topic VARCHAR(100) REFERENCES topics(slug), 
      author VARCHAR(50) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );`);
		})
		.then(() => {
			return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY NOT NULL, 
        author VARCHAR(50) REFERENCES users(username), 
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE, 
        votes INT, 
        created_at TIMESTAMP DEFAULT NOW(), 
        body VARCHAR
      );`);
		})
		.then(() => {
			const queryStr = format(
				`INSERT INTO topics (slug, description)
      VALUES
      %L RETURNING*;`,
				topicData.map((data) => [data.slug, data.description])
			);
			return db.query(queryStr);
		})
		.then(() => {
			const queryStr = format(
				`INSERT INTO users(username, avatar_url, name)
      VALUES
      %L RETURNING *;`,
				userData.map((data) => [data.username, data.avatar_url, data.name])
			);
			return db.query(queryStr);
		})
		.then(() => {
			const queryStr = format(
				`INSERT INTO articles (title, body, votes, topic, author, created_at)
        VALUES %L
        RETURNING*;`,
				articleData.map((data) => [
					data.title,
					data.body,
					data.votes,
					data.topic,
					data.author,
					data.created_at,
				])
			);
			return db.query(queryStr);
		})
		.then(() => {
			const queryStr = format(
				`INSERT INTO comments (author, article_id, votes, created_at, body) 
      VALUES %L 
      RETURNING*;`,
				commentData.map((data) => [
					data.author,
					data.article_id,
					data.votes,
					data.created_at,
					data.body,
				])
			);
			return db.query(queryStr);
		});
};

module.exports = seed;
