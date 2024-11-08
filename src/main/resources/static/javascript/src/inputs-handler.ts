import { HoldableObject } from 'osu-parsers';
import { getResultName } from './hit-windows.js';
import { startSong, time } from "./audio.js";
import { store } from './store.js';
import { HitsHandler } from './hits-handler.js';

export function addEventListeners(hitsHandler: HitsHandler) {
	const noteRating = document.querySelector('#note-rating')!;

	function getRating(columnId): string {
		const hit = hitsHandler.closestHit(columnId);

		const offset = hit.startTime - time();

		if (hit instanceof HoldableObject && Math.abs(offset) <= hit.duration) {
			return getResultName(6);
		} else {
			const resultId = hit.hitWindows.resultFor(offset);
			return getResultName(resultId);
		}
	}

	const keyToColumnMapping = {
		'a': 0,
		'z': 1,
		'e': 2,
		'r': 3,
		't': 4,
	}

	const keyEvents = {
		'a': () => getRating(keyToColumnMapping['a']),
		'z': () => getRating(keyToColumnMapping['z']),
		'e': () => getRating(keyToColumnMapping['e']),
		'r': () => getRating(keyToColumnMapping['r']),
		't': () => getRating(keyToColumnMapping['t']),
		' ': startSong,
	}



	document.addEventListener('keydown', (event) => {
		event.preventDefault();

		if (store.keyStates[event.key] === 'UP' || hitsHandler.closestHit(keyToColumnMapping[event.key]) instanceof HoldableObject) {
			const rating = keyEvents[event.key]();
			if (rating) {
				noteRating.innerHTML = rating;
			}
			store.keyStates[event.key] = 'PRESSED'
		}
	});

	document.addEventListener('keyup', (event) => {
		event.preventDefault();

		store.keyStates[event.key] = 'UP';
	});
}