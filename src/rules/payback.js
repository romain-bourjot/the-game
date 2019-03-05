import {dispatchEvent} from '../event';

const DURATION = 3000;

export const paybackRule = function paybackRule({eventEmitter}) {
	let timeout = null;

	const enablePayback = ({detail}) => {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;
		}
		dispatchEvent(eventEmitter, 'ENABLE_PAYBACK', {delta: 1});

		timeout = window.setTimeout(
			() => { dispatchEvent(eventEmitter, 'DISABLE_PAYBACK', {delta: 1}); },
			DURATION
		);
	};

	eventEmitter.addEventListener(
		'BOOST_COLLISION',
		enablePayback
	);
};
