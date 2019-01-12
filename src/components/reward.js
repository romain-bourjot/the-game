const {Component} = require('../component');

module.exports.Reward = class Reward extends Component {
	constructor({maxWidth, maxHeight}) {
		super({
			x: Math.random() * (maxWidth - 20),
			y: Math.random() * (maxHeight - 20),
			width: 20,
			height: 20
		});
		this.collisionEvent = 'REWARD_COLLISION';
		this.color = 'blue';
	}

	shouldUpdate() {
		return false;
	}

	render(drawer) {
		drawer.fillRect(this);
	}
};
