// variables

const {distance, collision} = require('./physics');
const {getDrawer} = require('./drawer');
const {nebulaOnHeroFX, fireOnHeroFX} = require('./fx');

let spawn = 0;

const accelerationMax = 1;
const speedLimit = 15;
const friction = 0.95;
const brake = 0.2;
// const powerUpSpeed = 0.3;
const adaptationEnnemi = 20;
const PowerUpspawnRate = 0.8;

class Foe {
	constructor({image, x, y}) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = 15;
		this.height = 15;
		this.adaptation = 20;
		this.speed = 0;
		this.done = false;
		this.started = Date.now();
	}

	update({hero, score}) {
		const norm = distance(hero, this);

		const vy = (hero.y - this.y) * this.speed / norm;
		const vx = (hero.x - this.x) * this.speed / norm;

		this.y += vy;
		this.x += vx;
		this.speed = score / this.adaptation;
	}

	render(drawer) {
		drawer.drawElement(this);
	}
}

const hero = {
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	speed: {
		x: 0,
		y: 0
	},
	acceleration: {
		x: 0,
		y: 0
	}

};

const reward = {
	x: 100,
	y: 100,
	width: adaptationEnnemi,
	height: adaptationEnnemi
};

const state = {
	_startTime: Date.now(),
	time: Date.now(),
	hero,
	foes: [],
	effects: [],
	score: 0
};

const canvas = document.querySelector('canvas');

const powerUp = {
	x: Math.random() * canvas.width,
	y: Math.random() * canvas.height,
	width: 10,
	height: 10,
	speed: 0.3
};

const ctx = canvas.getContext('2d');
const drawer = getDrawer({canvas, ctx});

function draw() {
	hero.image = document.getElementById('hero-img');

	drawer.clearScreen();

	ctx.fillStyle = 'blue';
	ctx.fillRect(reward.x, reward.y, reward.width, reward.height);

	drawer.drawScore(state.score);

	state.foes.forEach(
		foe => foe.render(drawer)
	);

	state.effects.forEach(
		fx => fx.render(drawer)
	);

	drawer.drawElement(hero);

	if (spawn > PowerUpspawnRate) {
		ctx.fillStyle = 'cyan';
		ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
	}
}

function keyDown(evt) {
	if (evt.key === 'ArrowDown') {
		hero.acceleration.y = accelerationMax;
	}
	if (evt.key === 'ArrowUp') {
		hero.acceleration.y = -accelerationMax;
	}
	if (evt.key === 'ArrowRight') {
		hero.acceleration.x = accelerationMax;
	}
	if (evt.key === 'ArrowLeft') {
		hero.acceleration.x = -accelerationMax;
	}
	if (evt.key === 'Shift') {
		hero.speed.x *= brake;
		hero.speed.y *= brake;
	}
}

function update() {
	state.time = Date.now() - state._startTime;
	state.effects = state.effects.filter(fx => !fx.done);

	if (state.score < 1 && state.foes.length > 0) {
		state.foes = [];
	}

	if (state.score >= 1 && state.foes.length < 1) {
		const image = document.getElementById('badguy-img');
		state.foes.push(new Foe({
			image,
			x: Math.random() * (canvas.width - reward.width),
			y: Math.random() * (canvas.height - reward.height)
		}));
	}

	if (state.score < 20 && state.foes.length > 1) {
		state.foes.pop();
	}

	if (state.score >= 20 && state.foes.length < 2) {
		const image = document.getElementById('badguy-img');
		state.foes.push(new Foe({
			image,
			x: Math.random() * (canvas.width - reward.width),
			y: Math.random() * (canvas.height - reward.height)
		}));
	}

	state.foes.forEach(
		foe => foe.update(state)
	);
	state.effects.forEach(
		foe => foe.update(state)
	);

	// acceleration
	hero.speed.x += hero.acceleration.x;
	hero.speed.y += hero.acceleration.y;
	hero.x += hero.speed.x;
	hero.y += hero.speed.y;

	if (hero.speed.x > speedLimit) {
		hero.speed.x = speedLimit;
	}
	if (hero.speed.y > speedLimit) {
		hero.speed.y = speedLimit;
	}
	hero.speed.x *= friction;
	hero.speed.y *= friction;

	// test collision murs
	if (hero.y + hero.height < 0) {
		hero.y = canvas.height;
	}
	if (hero.y > canvas.height) {
		hero.y = 0;
	}

	if (hero.x + hero.width < 0) {
		hero.x = canvas.width;
	}
	if (hero.x > canvas.width) {
		hero.x = 0;
	}

	// collisions
	if (collision(reward, hero)) {
		state.score += 1;
		state.effects.push(nebulaOnHeroFX(state));

		reward.x = Math.random() * (canvas.width - reward.width);
		reward.y = Math.random() * (canvas.height - reward.height);
		if (spawn < PowerUpspawnRate) {
			spawn = Math.random();
		}
	}

	const collidingFoe = state.foes.find(
		foe => collision(foe, hero)
	);

	if (collidingFoe) {
		state.score -= Math.round(state.score / 10);
		state.hero.x = 1;
		state.hero.y = 1;
	}

	if (spawn > PowerUpspawnRate) {
		if (collision(powerUp, hero)) {
			document.getElementById('game-zone').classList.remove('wiggle');
			window.setTimeout(() => document.getElementById('game-zone').classList.add('wiggle'), 0);

			state.effects.push(fireOnHeroFX(state));
			state.score += 5;
			powerUp.x = Math.random() * (canvas.width - powerUp.width);
			powerUp.y = Math.random() * (canvas.height - powerUp.height);
			spawn = Math.random();
		}
	}
	draw();
	requestAnimationFrame(update);
}

function keyUp(evt) {
	if (evt.key === 'ArrowRight' || evt.key === 'ArrowLeft') {
		hero.acceleration.x = 0;
	}
	if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
		hero.acceleration.y = 0;
	}
}

window.onkeyup = keyUp;
window.onkeydown = keyDown;

function onReady(fn) {
	const isReady = document.attachEvent ?
		document.readyState === 'complete' :
		document.readyState !== 'loading';

	if (isReady) {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

onReady(() => {
	update();
});
