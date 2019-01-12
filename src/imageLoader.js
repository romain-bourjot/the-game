module.exports.imageLoader = function ImageLoader(doc, callback) {
	const elements = Array.from(doc.querySelectorAll('img[data-src]'));
	const loaded = Array(elements.length).fill(false);

	const images = {};

	elements.forEach(
		(el, i) => {
			el.addEventListener(
				'load',
				() => {
					loaded[i] = true;
					images[el.dataset.name] = el;
					if (typeof loaded.find(x => !x) === 'undefined') {
						callback(images);
					}
				}
			);

			el.setAttribute('src', el.dataset.src);
		}
	);
};
