const {dispatchEvent} = require('../event');

module.exports.rewardRule = function rewardRule({eventEmitter}) {
	eventEmitter.addEventListener(
		'REWARD_COLLISION',
		({detail}) => {
			dispatchEvent(eventEmitter, 'DESTROY_REWARDS', {rewards: detail.rewards});
			dispatchEvent(eventEmitter, 'CREATE_REWARD');
			dispatchEvent(eventEmitter, 'SCORE_INCREMENT', {delta: 1});
		}
	);
};
