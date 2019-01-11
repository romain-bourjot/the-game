module.exports.distance = function(point1, point2) {
	const x1 = point1.x;
	const y1 = point1.y;
	const x2 = point2.x;
	const y2 = point2.y;

	return Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2));
};

module.exports.collision = function(elem1, elem2) {
	const xIntersection =
		elem1.x + elem1.width >= elem2.x &&
		elem1.x <= elem2.x + elem2.width;

	const yIntersection =
		elem1.y + elem1.height >= elem2.y &&
		elem1.y <= elem2.y + elem2.height;

	return xIntersection && yIntersection;
};
