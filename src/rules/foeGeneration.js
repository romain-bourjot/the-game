import {dispatchEvent} from '../event';

const THRESHOLD = 5;

export const foeGeneration = function({eventEmitter}) {
	this.lastScore = 0;

	eventEmitter.addEventListener(
		'SCORE_CHANGE',
		({detail}) => {
			if (detail.score < this.lastScore) {
				this.lastScore = detail.score;
			} else if (detail.score - this.lastScore > THRESHOLD) {
				dispatchEvent(eventEmitter, 'CREATE_FOE');
				this.lastScore = detail.score;
			}
		}
	);
};
