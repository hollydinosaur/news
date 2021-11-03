const {
	createReferenceObj,
	formatArray,
	orderFilter,
	validateTopic,
} = require("../utils");

describe("reference object", () => {
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
});

describe("format array", () => {
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

describe("order filter", () => {
	it("should identify a valid order filter and return it", () => {
		expect(orderFilter("ASC")).toBe("ASC");
	});
});

describe("validate topic", () => {
	it("should identify a valid topic and return it", () => {
		expect(validateTopic("mitch")).toBe("mitch");
	});
});
