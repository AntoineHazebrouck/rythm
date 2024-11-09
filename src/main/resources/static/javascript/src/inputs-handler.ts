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
	const keyEvents: Record<string, () => void> = {
		a: () => htmlDisplayHandler.displayRating(store.keyToColumnMapping['a']),
		z: () => htmlDisplayHandler.displayRating(store.keyToColumnMapping['z']),
		e: () => htmlDisplayHandler.displayRating(store.keyToColumnMapping['e']),
		r: () => htmlDisplayHandler.displayRating(store.keyToColumnMapping['r']),
		t: () => htmlDisplayHandler.displayRating(store.keyToColumnMapping['t']),
		' ': startSong,
	};

	document.addEventListener('keydown', (event) => {
		event.preventDefault();

		if (
			store.keyStates[event.key] === 'UP' ||
			hitsHandler.closestHit(store.keyToColumnMapping[event.key]) instanceof
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
