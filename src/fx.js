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
		this.done = this.duration && time - this.start > this.duration;
		this.x = hero.x - this.width / 2 + hero.width / 2;
		this.y = hero.y - this.height / 2 + hero.height / 2;
		this.index = Math.floor((time - this.start) / this.rate) % this.maxIndex;
	}

	shouldRender() { return true; }
	shouldUpdate() { return true; }

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

export const nebulaOnHeroFX = function({image, time, hero}) {
	return new Effect({
		image,
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
		duration: null,
		rate: 100,
		rows: 8,
		cols: 8
	});
};

export const fireOnHeroFX = function({image, time, hero}) {
	return new Effect({
		image,
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
		duration: null,
		rate: 100,
		rows: 8,
		cols: 8
	});
};

export const flamesUnderHeroFX = function({image, time, hero}) {
	const fx = new Effect({
		image,
		time,
		x: hero.x,
		y: hero.y,
		width: 100,
		height: 100,
		maxIndex: 61,
		spriteWidth: 150,
		spriteHeight: 150,
		sheetWidth: 800,
		sheetHeight: 800,
		duration: null,
		rate: 100,
		rows: 8,
		cols: 8
	});

	fx.update = function(state) {
		this.x = state.hero.x - this.width / 2 + state.hero.width / 2;
		this.y = state.hero.y + state.hero.height / 2;
		this.index = Math.floor((state.time - this.start) / this.rate) % this.maxIndex;
	};

	fx.render = function(drawer) {
		drawer.drawSprite({
			image: this.image,
			dx: this.x,
			dy: this.y,
			dw: this.width,
			dh: this.height,
			sx: (this.index % this.cols) * this.spriteWidth,
			sy: Math.floor(this.index / this.cols) * this.spriteHeight,
			sw: this.spriteWidth,
			sh: this.spriteHeight,
			th: 180
		});
	};

	return fx;
};
