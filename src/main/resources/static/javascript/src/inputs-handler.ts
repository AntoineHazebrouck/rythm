import { HoldableObject } from 'osu-parsers';
import { startSong } from './audio.js';
import { CanvasDisplayHandler, HtmlDisplayHandler } from './display-handler.js';
import { HitsHandler } from './hits-handler.js';
import { store } from './store.js';

export function addEventListeners(
	hitsHandler: HitsHandler,
	canvasDisplayHandler: CanvasDisplayHandler,
	htmlDisplayHandler: HtmlDisplayHandler
) {
	const keyToColumnMapping = {
		a: 0,
		z: 1,
		e: 2,
		r: 3,
		t: 4,
	};

	const keyEvents: Record<string, () => void> = {
		a: () => htmlDisplayHandler.displayRating(keyToColumnMapping['a']),
		z: () => htmlDisplayHandler.displayRating(keyToColumnMapping['z']),
		e: () => htmlDisplayHandler.displayRating(keyToColumnMapping['e']),
		r: () => htmlDisplayHandler.displayRating(keyToColumnMapping['r']),
		t: () => htmlDisplayHandler.displayRating(keyToColumnMapping['t']),
		' ': startSong,
	};

	document.addEventListener('keydown', (event) => {
		event.preventDefault();

		if (
			store.keyStates[event.key] === 'UP' ||
			hitsHandler.closestHit(keyToColumnMapping[event.key]) instanceof
				HoldableObject
		) {
			keyEvents[event.key]();
			store.keyStates[event.key] = 'PRESSED';
		}
	});

	document.addEventListener('keyup', (event) => {
		event.preventDefault();

		store.keyStates[event.key] = 'UP';
	});
}
