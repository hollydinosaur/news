const { orderFilter, validateTopic, validateUsername } = require("../utils");

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

describe.only("validate username", () => {
	it("should identify whether the given username is valid and returns the username if valid", () => {
		expect(validateUsername("rogersop")).toBe("rogersop");
	});
});
