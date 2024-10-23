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
	const current = Math.round(audio.currentTime * 1000);
	const next = hits.find((hit) => hit.startTime > current);

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.moveTo(0, next.startTime - current);
	context.lineTo(200, next.startTime - current);
	context.stroke();

	// setTimeout(() => {
	// }, 1000)
}, 1);


requestAnimationFrame(() => {

})
