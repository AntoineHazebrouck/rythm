import startDisplaying from './scripts/display';
import { closestHit } from './scripts/hits';
import startSong from './scripts/start-song';
import time from './scripts/time';

const noteRating = document.querySelector('h1');

document.querySelector('.start-song').addEventListener('click', startSong);
document.querySelector('.event').addEventListener('click', () => {
	console.log(time());
	console.log(nextHits());
});

document.addEventListener('keydown', function (event) {
	if (event.key == 'z') {
		const hit = closestHit();
		const offset = hit.startTime - time();
		const rating = hit.hitWindows.resultFor(offset);
		noteRating.innerText = rating;

		console.log(offset);
	}
});

startDisplaying();
