import {Component} from '../component';
import {distance} from '../physics';

export class Foe extends Component {
	constructor({image, x, y}) {
		super({x, y, width: 15, height: 15});
		this.image = image;
		this.adaptation = 20;
		this.speed = 0;
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
