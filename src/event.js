module.exports.dispatchEvent = function dispatchEvent(eventEmitter, name, detail) {
	eventEmitter.dispatchEvent(new CustomEvent(name, {detail}));
};
