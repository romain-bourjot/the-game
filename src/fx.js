class Effect {
	constructor({
		image,
		time,
		x,
		y,
		width,
		height,
		maxIndex,
		spriteWidth,
		spriteHeight,
		sheetWidth,
		sheetHeight,
		duration,
		rate,
		rows,
		cols
	}) {
		this.start = time;
		this.rows = rows;
		this.cols = cols;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.index = 0;
		this.maxIndex = maxIndex;

		this.spriteWidth = sheetWidth / this.cols;
		this.spriteHeight = sheetHeight / this.rows;

		this.rate = rate;
		this.image = image;
		this.done = false;
		this.duration = duration;
	}

	update({time, hero}) {
		this.done = time - this.start > this.duration;
		this.x = hero.x - this.width / 2 + hero.width / 2;
		this.y = hero.y - this.height / 2 + hero.height / 2;
		this.index = Math.floor((time - this.start) / this.rate) % this.maxIndex;
	}

	render(drawer) {
		drawer.drawSprite({
			image: this.image,
			dx: this.x,
			dy: this.y,
			dw: this.width,
			dh: this.height,
			sx: (this.index % this.cols) * this.spriteWidth,
			sy: Math.floor(this.index / this.cols) * this.spriteHeight,
			sw: this.spriteWidth,
			sh: this.spriteHeight
		});
	}
}

module.exports.nebulaOnHeroFX = function({time, hero}) {
	return new Effect({
		image: document.getElementById('nebula-fx-img'),
		time,
		x: hero.x,
		y: hero.y,
		width: 100,
		height: 100,
		maxIndex: 61,
		spriteWidth: 100,
		spriteHeight: 100,
		sheetWidth: 800,
		sheetHeight: 800,
		duration: 800,
		rate: 100,
		rows: 8,
		cols: 8
	});
};

module.exports.fireOnHeroFX = function({time, hero}) {
	return new Effect({
		image: document.getElementById('fire-fx-img'),
		time,
		x: hero.x,
		y: hero.y,
		width: 200,
		height: 200,
		maxIndex: 61,
		spriteWidth: 100,
		spriteHeight: 100,
		sheetWidth: 800,
		sheetHeight: 800,
		duration: 1500,
		rate: 100,
		rows: 8,
		cols: 8
	});
};
