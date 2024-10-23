import { BeatmapDecoder } from 'osu-parsers';
import osuMap from './resources/osu/Tan Bionica - Ciudad Magica/map.osu';
import audio from './scripts/audio';
import startSong from './scripts/start-song';

document.querySelector('.start-song').addEventListener('click', startSong);
document.querySelector('.event').addEventListener('click', () => {
	console.log(Math.round(audio.currentTime * 1000));
	console.log(hits[0].startTime);
});

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const map = await new BeatmapDecoder().decodeFromString(osuMap);
const hits = map.hitObjects.sort((left, right) => left - right);

setInterval(function () {
	const time = Math.round(audio.currentTime * 1000);
	const nextHits = hits.filter((hit) => hit.startTime > time);

	context.clearRect(0, 0, canvas.width, canvas.height);
	nextHits.forEach((hit) => {
		context.beginPath();
		context.moveTo(0, hit.startTime - time);
		context.lineTo(200, hit.startTime - time);
		context.stroke();
	});
}, 1);

requestAnimationFrame(() => {
	// TODO
});
