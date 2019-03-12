import {Component} from '../component';

const FRAME_DURATION = 50;
const MIN_SPEED = -1;
const MAX_SPEED = -8;

export class Background extends Component {
	constructor({images, width, height, eventEmitter}) {
		super({x: 0, y: 0, width, height});
		this.lastRender = null;
		this.lastUpdate = null;
		this.images = images;

		this.speeds = Array(images.length).fill(0);
		this.positions = Array(images.length).fill(0);
		this.maxHeights = Array(images.length).fill(0);

		let i = images.length;
		while (i--) {
			this.speeds[i] = MIN_SPEED * Math.pow(2, images.length - i - 1);
			this.maxHeights[i] = images[i].height - height;
		}

		eventEmitter.addEventListener(
			'ENABLE_PAYBACK', // 'ENABLE_SPEED_MODE',
			() => {
				let j = images.length;
				while (j--) {
					this.speeds[j] = MAX_SPEED * Math.pow(2, images.length - j - 1);
					this.maxHeights[j] = images[j].height - height;
				}
			}
		);

		eventEmitter.addEventListener(
			'DISABLE_PAYBACK', // 'DISABLE_SPEED_MODE',
			() => {
				let j = images.length;
				while (j--) {
					this.speeds[j] = MIN_SPEED * Math.pow(2, images.length - j - 1);
					this.maxHeights[j] = images[j].height - height;
				}
			}
		);
	}

	shouldRender({time}) {
		return !this.lastRender || (time - this.lastRender) >= FRAME_DURATION;
	}

	shouldUpdate({time}) {
		return this.lastRender || (time - this.lastUpdate) >= FRAME_DURATION;
	}

	update({time}) {
		let i = this.images.length;
		while (i--) {
			this.positions[i] = (this.positions[i] + this.speeds[i]) % this.maxHeights[i];
			if (this.positions[i] < 0) {
				this.positions[i] = this.maxHeights[i];
			}
		}
		this.lastUpdate = time;
	}

	render(drawer, {time}) {
		let i = this.images.length;

		while (i--) {
			drawer.drawSprite({
				image: this.images[i],
				dx: 0,
				dy: 0,
				dw: this.width,
				dh: this.height,
				sx: 0,
				sy: this.positions[i],
				sw: this.width,
				sh: this.height
			});
		}
		this.lastRender = time;
	}
}
