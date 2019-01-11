module.exports.getDrawer = ({canvas, ctx}) => {
	return {
		drawScore: (score) => {
			const height = 20;
			ctx.font = `${height}px Verdana`;
			ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';

			const scoreLabel = `SCORE: ${score}`;
			const {width} = ctx.measureText(scoreLabel);

			ctx.fillText(scoreLabel, (canvas.width - width) / 2, 15 + height);
		},

		clearScreen: () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},

		drawElement: ({image, x, y, width, height}) => {
			ctx.drawImage(image, x, y, width, height);
		},

		drawSprite: ({image, sx, sy, sw, sh, dx, dy, dw, dh}) => {
			ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		}
	};
};
