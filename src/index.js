// variables

require('./index.css');
require('./menu.css');
require('./background.css');

const {menu} = require('./menu');

const {imageLoader} = require('./imageLoader');
const {collision} = require('./physics');
const {getDrawer} = require('./drawer');
const {dispatchEvent} = require('./event');

const {nebulaOnHeroFX, fireOnHeroFX} = require('./fx');

const {Foe} = require('./components/foe');
const {Hero} = require('./components/hero');
const {Background} = require('./components/background');
const {Score} = require('./components/score');
const {Reward} = require('./components/reward');
const {Boost} = require('./components/boost');

const {foeGeneration} = require('./rules/foeGeneration');
const {rewardRule} = require('./rules/reward');
const {invincibilityRule} = require('./rules/invincibility');
const {paybackRule} = require('./rules/payback');
const {boostRule} = require('./rules/boost');

// XXX
let heroImage = null;
let nebulaImage = null;
let smallStarsImage = null;
let bigStarsImage = null;
let badGuyImage = null;
let fireFxImage = null;
let flamesFxImage = null; // eslint-disable-line no-unused-vars
let nebulaFxImage = null;

function init() { // eslint-disable-line no-unused-vars
	const speedLimit = 15;
	const friction = 0.95;

	const eventEmitter = document.getElementById('game-zone');

	const canvas = document.getElementById('main-canvas');
	const stillCanvas = document.getElementById('still-canvas');
	const bgCanvas = document.getElementById('bg-canvas');

	foeGeneration({eventEmitter});
	invincibilityRule({eventEmitter});
	rewardRule({eventEmitter});
	boostRule({eventEmitter});
	paybackRule({eventEmitter});

	const hero = new Hero({image: heroImage, eventEmitter});

	const state = {
		canvas,
		speedLimit,
		friction,
		_startTime: Date.now(),
		time: Date.now(),
		hero,
		foes: [],
		rewards: [],
		effects: [],
		score: 0,
		backgroundPosition: [0, 0, 0],
		backgroundSpeed: -4,
		speedMode: false,
		paybackMode: false
	};

	const scoreComponent = new Score({score: state.score, eventEmitter});

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

	const background = new Background({
		images: [bigStarsImage, smallStarsImage, nebulaImage],
		width: bgCanvas.width,
		height: bgCanvas.height,
		eventEmitter
	});

	let paybackFx = null;
	eventEmitter.addEventListener(
		'ENABLE_PAYBACK',
		({detail}) => {
			if (!paybackFx || paybackFx.done) {
				paybackFx = fireOnHeroFX(Object.assign({image: fireFxImage}, state));
				state.effects.push(paybackFx);
			}
			state.paybackMode = true;
		}
	);

	eventEmitter.addEventListener(
		'DISABLE_PAYBACK',
		({detail}) => {
			paybackFx.done = true;
			state.paybackMode = false;
		}
	);

	eventEmitter.addEventListener(
		'SCORE_INCREMENT',
		({detail}) => {
			state.score = Math.max(0, state.score + detail.delta);
			dispatchEvent(eventEmitter, 'SCORE_CHANGE', {score: state.score});
		}
	);

	eventEmitter.addEventListener(
		'CREATE_FOE',
		() => {
			state.foes.push(new Foe({
				image: badGuyImage,
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height
			}));
		}
	);

	eventEmitter.addEventListener(
		'CREATE_REWARD',
		() => {
			state.rewards.push(new Reward({
				maxWidth: canvas.width,
				maxHeight: canvas.height
			}));
		}
	);

	eventEmitter.addEventListener(
		'DESTROY_REWARDS',
		({detail}) => {
			detail.rewards.forEach(el => el.destroy());
		}
	);

	eventEmitter.addEventListener(
		'CREATE_BOOST',
		() => {
			state.rewards.push(new Boost({
				maxWidth: canvas.width,
				maxHeight: canvas.height
			}));
		}
	);

	eventEmitter.addEventListener(
		'DESTROY_BOOSTS',
		({detail}) => {
			console.log(detail);
			detail.boosts.forEach(el => el.destroy());
		}
	);

	let invFx = null;
	eventEmitter.addEventListener(
		'ENABLE_INVINCIBILITY',
		() => {
			if (!invFx || invFx.done) {
				invFx = nebulaOnHeroFX(Object.assign({image: nebulaFxImage}, state));
				state.effects.push(invFx);
			}
			state.invincibilityMode = true;
		}
	);

	eventEmitter.addEventListener(
		'DISABLE_INVINCIBILITY',
		() => {
			invFx.done = true;
			state.invincibilityMode = false;
		}
	);

	eventEmitter.addEventListener(
		'DEATH',
		() => {
			dispatchEvent(
				eventEmitter,
				'SCORE_INCREMENT',
				{delta: -Math.max(1, Math.round(state.score / 10))}
			);
			state.hero.x = 1;
			state.hero.y = 1;
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
			dispatchEvent(eventEmitter, DOM_COMMAND_KEY_DOWN_MAP[evt.key]);
		}
	}

	function keyUp(evt) {
		if (DOM_COMMAND_KEY_UP_MAP.hasOwnProperty(evt.key)) {
			dispatchEvent(eventEmitter, DOM_COMMAND_KEY_UP_MAP[evt.key]);
		}
	}

	dispatchEvent(eventEmitter, 'CREATE_REWARD');

	function update() {
		state.time = Date.now() - state._startTime;

		// Render
		if (background.shouldRender(state)) {
			background.render(bgDrawer, state);
		}

		drawer.clearScreen();

		state.foes.forEach(el => el.shouldRender() && el.render(drawer));
		state.effects.forEach(el => el.shouldRender() && el.render(drawer));
		state.rewards.forEach(el => el.shouldRender() && el.render(drawer));

		drawStill();

		state.hero.render(drawer);

		// Update
		state.effects = state.effects.filter(fx => !fx.done);
		state.foes = state.foes.filter(foe => !foe.destroyed);
		state.rewards = state.rewards.filter(reward => !reward.destroyed);

		if (background.shouldUpdate(state)) {
			background.update(bgDrawer, state);
		}

		state.hero.update(state);

		state.foes.forEach(el => el.shouldUpdate() && el.update(state));
		state.effects.forEach(el => el.shouldUpdate() && el.update(state));
		state.rewards.forEach(el => el.shouldUpdate() && el.update(state));

		const collidingRewards = state.rewards.filter(
			reward => collision(reward, hero)
		);
		if (collidingRewards.length > 0) {
			collidingRewards.forEach(
				(reward) => dispatchEvent(
					eventEmitter,
					reward.collisionEvent,
					{rewards: collidingRewards}
				)
			);
		}

		const collidingFoes = state.foes.filter(
			foe => collision(foe, hero)
		);

		if (collidingFoes.length > 0) {
			if (state.paybackMode) {
				collidingFoes.forEach(foe => foe.destroy());
			} else if (!state.invincibilityMode) {
				dispatchEvent(eventEmitter, 'DEATH');
			}
		}

		scoreComponent.update(state);

		requestAnimationFrame(update);
	}

	window.onkeyup = keyUp;
	window.onkeydown = keyDown;

	requestAnimationFrame(update);
}

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
	const loader = document.querySelector('.loader');
	// const main = document.querySelector('.main');
	// const space = document.querySelector('.space');

	imageLoader(document, (images) => {
		heroImage = images['hero-img'];
		nebulaImage = images['nebula-bg-img'];
		smallStarsImage = images['stars-small-bg-img'];
		bigStarsImage = images['stars-big-bg-img'];
		badGuyImage = images['badguy-img'];
		fireFxImage = images['fire-fx-img'];
		flamesFxImage = images['flames-fx-img'];
		nebulaFxImage = images['nebula-fx-img'];

		loader.classList.remove('loading');
		loader.classList.add('loaded');

		// main.classList.remove('hidden');
		// space.classList.remove('hidden');

		menu();
		// init();
	});
});
