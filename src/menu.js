// @flow

function setIndex(playerElements, idx) {
	playerElements.forEach(
		(el, i) => {
			if (i < idx) {
				el.classList.add('left-player');
				el.classList.remove('right-player');
				el.classList.remove('selected');
			} else if (i > idx) {
				el.classList.remove('left-player');
				el.classList.add('right-player');
				el.classList.remove('selected');
			} else {
				el.classList.remove('left-player');
				el.classList.remove('right-player');
				el.classList.add('selected');
			}
		}
	);
}
module.exports.menu = function menu() {
	const menuElement = document.querySelector('.menu');
	const playerElements = Array.from(document.querySelectorAll('.player'));

	let idx = Math.floor(playerElements.length / 2);
	setIndex(playerElements, idx);

	window.setInterval(
		() => {
			idx = (idx - 1) % playerElements.length;
			idx = idx < 0 ? playerElements.length - 1 : idx;
			setIndex(playerElements, idx);
		},
		2000
	);

	menuElement.classList.remove('hidden');
};
