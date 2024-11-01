import { closestHit } from './hits.js';
import startSong from './start-song.js';
import time from './time.js';

export function addEventListeners() {
	const noteRating = document.querySelector('h1');

	document.querySelector('.start-song').addEventListener('click', startSong);
	document.querySelector('.event').addEventListener('click', () => {
		console.log(time());
		console.log(nextHits());
	});

	function getRating(columnId) {
		const hit = closestHit(columnId);
		const offset = hit.startTime - time();
		return hit.hitWindows.resultFor(offset);
	}

	const keyEvents = {
		'a': () => getRating(0),
		'z': () => getRating(1),
		'e': () => getRating(2),
		'r': () => getRating(3),
		't': () => getRating(4),
	}

	document.addEventListener('keydown', function (event) {
		const rating = keyEvents[event.key]();
		noteRating.innerText = rating;
	});
}