const {Component} = require('../component');

module.exports.Score = class Score extends Component {
	constructor({eventEmitter}) {
		super({x: 0, y: 0, width: 0, height: 0});
		this.score = null;
		this._shouldRender = true;

		eventEmitter.addEventListener(
			'SCORE_CHANGE',
			({detail}) => { this.score = detail.score; this._shouldRender = true; }
		);
	}

	shouldUpdate() { return false; }
	shouldRender() { return this._shouldRender; }

	update() {}

	render(drawer) {
		const ctx = drawer.getCtx();
		const canvas = drawer.getCanvas();

		const height = 25;
		ctx.font = `${height}px Neuropol`;

		const scoreLabel = `SCORE: ${this.score}`;
		const {width} = ctx.measureText(scoreLabel);

		ctx.filter = 'blur(3px)';
		ctx.fillStyle = 'rgba(255, 255, 215, 0.8)';
		ctx.fillText(scoreLabel, (canvas.width - width) / 2, 32 + height);
		ctx.filter = 'blur(0)';

		ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.fillText(scoreLabel, (canvas.width - width) / 2, 32 + height);

		this._shouldRender = false;
	}
};
