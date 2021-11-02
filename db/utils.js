exports.createReferenceObj = (arr, param1, param2) => {
	const newObject = {};
	arr.forEach((object) => (newObject[object[param1]] = object[param2]));
	return newObject;
};

exports.formatArray = (arr, refObj, param1, param2) => {
	const newArr = [];
	arr.forEach((element) => {
		const obj = { ...element };
		const val = obj[param1];
		obj[param2] = refObj[val];
		delete obj[param1];
		newArr.push(obj);
	});
	return newArr;
};
