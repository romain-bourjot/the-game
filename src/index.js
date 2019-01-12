// variables

require('./index.css');
require('./background.css');

const {collision} = require('./physics');
const {getDrawer} = require('./drawer');

const {nebulaOnHeroFX, fireOnHeroFX, flamesUnderHeroFX} = require('./fx');

const {Foe} = require('./components/foe');
const {Hero} = require('./components/hero');
const {Background} = require('./components/background');
const {Score} = require('./components/score');

let spawn = 0;

const speedLimit = 15;
const friction = 0.95;
// const powerUpSpeed = 0.3;
const adaptationEnnemi = 20;
const PowerUpspawnRate = 0.8;

const reward = {
	x: 100,
	y: 100,
	width: adaptationEnnemi,
	height: adaptationEnnemi
};

const eventEmitter = document.getElementById('game-zone');

function dispatchEvent(name, detail) {
	eventEmitter.dispatchEvent(new CustomEvent(name, {detail}));
}

const canvas = document.getElementById('main-canvas');
const stillCanvas = document.getElementById('still-canvas');
const bgCanvas = document.getElementById('bg-canvas');

const heroImage = document.getElementById('hero-img');

const hero = new Hero({image: heroImage, eventEmitter});

const state = {
	canvas,
	speedLimit,
	friction,
	_startTime: Date.now(),
	time: Date.now(),
	hero,
	foes: [],
	effects: [],
	score: 0,
	backgroundPosition: [0, 0, 0],
	backgroundSpeed: -4,
	speedMode: false
};

const scoreComponent = new Score({score: state.score, eventEmitter});

const powerUp = {
	x: Math.random() * canvas.width,
	y: Math.random() * canvas.height,
	width: 10,
	height: 10,
	speed: 0.3
};

const ctx = canvas.getContext('2d');
const drawer = getDrawer({canvas, ctx});

const stillDrawer = getDrawer({canvas: stillCanvas, ctx: stillCanvas.getContext('2d')});
const bgDrawer = getDrawer({canvas: bgCanvas, ctx: bgCanvas.getContext('2d')});

function drawStill() {
	if (scoreComponent.shouldRender()) {
		stillDrawer.clearScreen();
		scoreComponent.render(stillDrawer);
	}
}

const nebulaImage = document.getElementById('nebula-bg-img');
const smallStarsImage = document.getElementById('stars-small-bg-img');
const bigStarsImage = document.getElementById('stars-big-bg-img');

const background = new Background({
	images: [bigStarsImage, smallStarsImage, nebulaImage],
	width: bgCanvas.width,
	height: bgCanvas.height,
	eventEmitter
});

function enableSpeedMode(_state) {
	if (_state.speedMode) {
		return;
	}
	const flames = flamesUnderHeroFX({hero, time: 0});
	_state.effects.push(flames);
	_state.backgroundSpeed *= 8;

	dispatchEvent('enableSpeedMode');

	window.setTimeout(
		() => {
			flames.done = true;
			dispatchEvent('disableSpeedMode');
		},
		5000
	);
}

eventEmitter.addEventListener(
	'SCORE_INCREMENT',
	({detail}) => {
		state.score = Math.max(0, state.score + detail.delta);
		dispatchEvent('SCORE_CHANGE', {score: state.score});
	}
);

const DOM_COMMAND_KEY_DOWN_MAP = {
	ArrowDown: 'COMMAND_DOWN',
	ArrowUp: 'COMMAND_UP',
	ArrowLeft: 'COMMAND_LEFT',
	ArrowRight: 'COMMAND_RIGHT',
	Shift: 'COMMAND_BRAKE'
};

const DOM_COMMAND_KEY_UP_MAP = {
	ArrowDown: 'COMMAND_STOP_VERTICAL',
	ArrowUp: 'COMMAND_STOP_VERTICAL',
	ArrowLeft: 'COMMAND_STOP_HORIZONTAL',
	ArrowRight: 'COMMAND_STOP_HORIZONTAL'
};

function keyDown(evt) {
	if (DOM_COMMAND_KEY_DOWN_MAP.hasOwnProperty(evt.key)) {
		dispatchEvent(DOM_COMMAND_KEY_DOWN_MAP[evt.key]);
	}
}

function keyUp(evt) {
	if (DOM_COMMAND_KEY_UP_MAP.hasOwnProperty(evt.key)) {
		dispatchEvent(DOM_COMMAND_KEY_UP_MAP[evt.key]);
	}
}

function update() {
	state.time = Date.now() - state._startTime;

	// Render
	if (background.shouldRender(state)) {
		background.render(bgDrawer, state);
	}

	drawer.clearScreen();

	ctx.fillStyle = 'blue';
	ctx.fillRect(reward.x, reward.y, reward.width, reward.height);

	state.foes.forEach(
		foe => foe.render(drawer)
	);

	state.effects.forEach(
		fx => fx.render(drawer)
	);

	if (spawn > PowerUpspawnRate) {
		ctx.fillStyle = 'cyan';
		ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
	}

	drawStill();

	state.hero.render(drawer);

	// Update
	state.effects = state.effects.filter(fx => !fx.done);

	if (background.shouldUpdate(state)) {
		background.update(bgDrawer, state);
	}

	state.hero.update(state);

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

	// collisions
	if (collision(reward, hero)) {
		dispatchEvent('SCORE_INCREMENT', {delta: 1});
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
		dispatchEvent('SCORE_INCREMENT', {delta: -Math.round(state.score / 10)});
		state.hero.x = 1;
		state.hero.y = 1;
	}

	if (spawn > PowerUpspawnRate) {
		if (collision(powerUp, hero)) {
			document.getElementById('game-zone').classList.remove('wiggle');
			enableSpeedMode(state);
			window.setTimeout(() => document.getElementById('game-zone').classList.add('wiggle'), 0);

			state.effects.push(fireOnHeroFX(state));
			dispatchEvent('SCORE_INCREMENT', {delta: 5});
			powerUp.x = Math.random() * (canvas.width - powerUp.width);
			powerUp.y = Math.random() * (canvas.height - powerUp.height);
			spawn = Math.random();
		}
	}

	scoreComponent.update(state);

	requestAnimationFrame(update);
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
	requestAnimationFrame(update);
});
