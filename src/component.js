export const Component = class Component {
	constructor({x, y, width, height}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.destroyed = false;
	}

	shouldRender() { return true; }
	shouldUpdate() { return true; }
	update() {}
	render() {}
	destroy() {
		this.destroyed = true;
	}
};
