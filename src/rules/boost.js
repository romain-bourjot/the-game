const {dispatchEvent} = require('../event');

const RATE = 0.2;

module.exports.boostRule = function boostRule({eventEmitter}) {
	eventEmitter.addEventListener(
		'BOOST_COLLISION',
		({detail}) => {
			dispatchEvent(eventEmitter, 'DESTROY_BOOSTS', {boosts: detail.rewards});
			dispatchEvent(eventEmitter, 'SCORE_INCREMENT', {delta: 5});
		}
	);

	eventEmitter.addEventListener(
		'REWARD_COLLISION',
		() => {
			if (Math.random() < RATE) {
				dispatchEvent(eventEmitter, 'CREATE_BOOST');
			}
		}
	);
};
