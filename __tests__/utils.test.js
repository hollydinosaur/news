const { createReferenceObj, formatArray } = require("../utils");

describe("utils tests", () => {
	it("creates a reference object based on the given parameters", () => {
		const articles = [
			{
				article_name: "this name",
				article_id: 2,
			},
			{
				article_name: "that name",
				article_id: 1,
			},
		];
		const output = { "this name": 2, "that name": 1 };
		expect(createReferenceObj(articles, "article_name", "article_id")).toEqual(
			output
		);
	});
	it("creates a formatted array when passed an array, a reference object and two parameters", () => {
		const arr = [
			{
				article_id: 1,
				body: "so",
			},
			{
				article_id: 2,
				body: "nope",
			},
		];
		const outputArr = [
			{
				article_name: "oh",
				body: "so",
			},
			{
				article_name: "ooops",
				body: "nope",
			},
		];
		const param1 = "article_id";
		const param2 = "article_name";
		const refObj = { 1: "oh", 2: "ooops" };
		expect(formatArray(arr, refObj, param1, param2)).toEqual(outputArr);
	});
});
