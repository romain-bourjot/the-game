module.exports.getDrawer = ({canvas, ctx}) => {
	return {
		getCanvas: () => canvas,
		getCtx: () => ctx,

		clearScreen: () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},

		drawElement: ({image, x, y, width, height}) => {
			ctx.drawImage(image, x, y, width, height);
		},

		drawSprite: ({image, sx, sy, sw, sh, dx, dy, dw, dh, th, alpha}) => {
			const _th = th || 0;
			const _alpha = typeof alpha === 'undefined' ? 1 : alpha;

			ctx.globalAlpha = _alpha;
			ctx.translate(dx + dw / 2, dy + dh / 2);
			ctx.rotate(_th * Math.PI / 180);

			ctx.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);

			ctx.rotate(-_th * Math.PI / 180);
			ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
			ctx.globalAlpha = 1;
		},

		drawRect: ({color, x, y, width, height}) => {
			ctx.save();
			ctx.strokeStyle = color;
			ctx.strokeRect(x, y, width, height);
			ctx.restore();
		}
	};
};
