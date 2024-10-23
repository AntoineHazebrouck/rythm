import { BeatmapDecoder } from 'osu-parsers';
import osuMap from './resources/osu/Tan Bionica - Ciudad Magica/map.osu';
import audio from './scripts/audio';
import startSong from './scripts/start-song';

document.querySelector('.start-song').addEventListener('click', startSong);
document.querySelector('.event').addEventListener('click', () => {
	console.log(time());
	console.log(nextHits());
});

document.addEventListener('keydown', function (event) {
	if (event.key == 'z') {
		const closestHits = hits.sort(
			(left, right) =>
				Math.abs(left.startTime - time()) -
				Math.abs(right.startTime - time())
		);

		const closestHit = closestHits[0];

		const rating = closestHit.hitWindows.resultFor(
			closestHit.startTime - time()
		);
		noteRating.innerText = rating;
		console.log(rating);
	}
});

const noteRating = document.querySelector('h1');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const hits = await new BeatmapDecoder()
	.decodeFromString(osuMap)
	.hitObjects.sort((left, right) => left - right);

function time() {
	return Math.round(audio.currentTime * 1000);
}

function nextHits() {
	return hits.filter((hit) => hit.startTime > time());
}

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	nextHits().forEach((hit) => {
		context.beginPath();
		context.moveTo(0, hit.startTime - time());
		context.lineTo(200, hit.startTime - time());
		context.stroke();
	});
}

function refresh() {
	draw();
	requestAnimationFrame(refresh);
}
requestAnimationFrame(refresh);
