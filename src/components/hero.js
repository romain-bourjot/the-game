import {Component} from '../component';

const ACCELERATION_MAX = 1;
const BRAKE_COEF = 0.2;

export class Hero extends Component {
	constructor({image, eventEmitter}) {
		super({x: 0, y: 0, width: 50, height: 50});
		this.speed = {x: 0, y: 0};
		this.acceleration = {x: 0, y: 0};
		this.image = image;

		eventEmitter.addEventListener(
			'COMMAND_UP',
			() => { this.acceleration.y = -ACCELERATION_MAX; }
		);

		eventEmitter.addEventListener(
			'COMMAND_DOWN',
			() => { this.acceleration.y = ACCELERATION_MAX; }
		);

		eventEmitter.addEventListener(
			'COMMAND_LEFT',
			() => { this.acceleration.x = -ACCELERATION_MAX; }
		);

		eventEmitter.addEventListener(
			'COMMAND_RIGHT',
			() => { this.acceleration.x = ACCELERATION_MAX; }
		);

		eventEmitter.addEventListener(
			'COMMAND_STOP_HORIZONTAL',
			() => { this.acceleration.x = 0; }
		);

		eventEmitter.addEventListener(
			'COMMAND_STOP_VERTICAL',
			() => { this.acceleration.y = 0; }
		);

		eventEmitter.addEventListener(
			'COMMAND_BRAKE',
			() => {
				this.speed.y *= BRAKE_COEF;
				this.speed.x *= BRAKE_COEF;
			}
		);
	}

	update({canvas, speedLimit, friction}) {
		this.speed.x = Math.min(speedLimit, this.speed.x + this.acceleration.x);
		this.speed.y = Math.min(speedLimit, this.speed.y + this.acceleration.y);

		this.x = (this.x + this.speed.x) % canvas.width;
		this.y = (this.y + this.speed.y) % canvas.height;

		if (this.y < -this.height) {
			this.y = canvas.height;
		}

		if (this.x < -this.width) {
			this.x = canvas.width;
		}

		this.speed.x *= friction;
		this.speed.y *= friction;
	}

	render(drawer) {
		drawer.drawElement({
			image: this.image,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		});
	}
}
