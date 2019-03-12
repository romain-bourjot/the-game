import {dispatchEvent} from '../event';

const DURATION = 800;

export const invincibilityRule = function invincibilityRule({eventEmitter}) {
	let timeout = null;

	const enableInvincibililty = ({detail}) => {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}
		dispatchEvent(eventEmitter, 'ENABLE_INVINCIBILITY', {delta: 1});

		timeout = window.setTimeout(
			() => { dispatchEvent(eventEmitter, 'DISABLE_INVINCIBILITY', {delta: 1}); },
			DURATION
		);
	};

	eventEmitter.addEventListener(
		'REWARD_COLLISION',
		enableInvincibililty
	);
	eventEmitter.addEventListener(
		'DEATH',
		enableInvincibililty
	);
};
