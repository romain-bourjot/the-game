const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// variables
let score = 0;
let spawn = 0;

const accelerationMax = 1;
const speedLimit = 15;
const friction = 0.95;
const brake = 0.2;
let vitesseEnnemi = 0;
// const powerUpSpeed = 0.3;
const adaptationEnnemi = 20;
const PowerUpspawnRate = 0.8;

const ennemi = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	width: 15,
	height: 15
};

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

const powerUp = {
	x: Math.random() * canvas.width,
	y: Math.random() * canvas.height,
	width: 10,
	height: 10,
	speed: 0.3
};

function distance(hy, hx, ey, ex) {
	return Math.sqrt(Math.pow(hy - ey, 2) + Math.pow(hx - ex, 2));
}

function drawScore(_score) {
	const height = 20;
	ctx.font = `${height}px Verdana`;
	ctx.fillStyle = 'rgba(0, 0, 0, .9)';
	const scoreLabel = `SCORE: ${score}`;
	const {width} = ctx.measureText(scoreLabel);

	ctx.fillText(scoreLabel, (canvas.width - width) / 2, 15 + height);
}

function draw() {
	const heroImg = document.getElementById('hero-img');
	const badguyImg = document.getElementById('badguy-img');

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(heroImg, hero.x, hero.y, hero.width, hero.height);

	ctx.fillStyle = 'blue';
	ctx.fillRect(reward.x, reward.y, reward.width, reward.height);

	drawScore(score);

	if (score >= 0) {
		ctx.drawImage(badguyImg, ennemi.x, ennemi.y, ennemi.width, ennemi.height);
	}
	if (spawn > PowerUpspawnRate) {
		ctx.fillStyle = 'cyan';
		ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
	}
}

function collision(r, h) {
	const xin = h.x + h.width >= r.x && h.x <= r.x + r.width;
	const yin = h.y + h.height >= r.y && h.y <= r.y + r.height;

	return xin && yin;
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
	const norme = distance(hero.y, hero.x, ennemi.y, ennemi.x);

	// ennemi
	const vy = (hero.y - ennemi.y) * vitesseEnnemi / norme;
	const vx = (hero.x - ennemi.x) * vitesseEnnemi / norme;

	if (score >= 10) {
		ennemi.y += vy;
		ennemi.x += vx;
		vitesseEnnemi = score / adaptationEnnemi;
	}

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
		score += 1;
		reward.x = Math.random() * (canvas.width - reward.width);
		reward.y = Math.random() * (canvas.height - reward.height);
		if (spawn < PowerUpspawnRate) {
			spawn = Math.random();
		}
	}
	if (score >= 10) {
		if (collision(ennemi, hero)) {
			score -= Math.round(score / 10);
			ennemi.x = canvas.width / 2;
			ennemi.y = canvas.height / 2;
			hero.x = 1;
			hero.y = 1;
		}
	}
	if (spawn > PowerUpspawnRate) {
		if (collision(powerUp, hero)) {
			score += 5;
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

onReady(update);
