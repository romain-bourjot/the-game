export const dispatchEvent = function dispatchEvent(eventEmitter, name, detail) {
	eventEmitter.dispatchEvent(new CustomEvent(name, {detail}));
};
