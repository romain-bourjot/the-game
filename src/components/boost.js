import {Component} from '../component';

export class Boost extends Component {
	constructor({maxWidth, maxHeight}) {
		super({
			x: Math.random() * (maxWidth - 20),
			y: Math.random() * (maxHeight - 20),
			width: 10,
			height: 10
		});
		this.collisionEvent = 'BOOST_COLLISION';
		this.color = 'cyan';
	}

	shouldUpdate() {
		return false;
	}

	render(drawer) {
		drawer.fillRect(this);
	}
}
