import { BeatmapDecoder } from 'osu-parsers';
import osuMap from './resources/osu/Tan Bionica - Ciudad Magica/map.osu';
import osuAudio from './resources/osu/Tan Bionica - Ciudad Magica/audio.ogg';

const audio = new Audio(osuAudio);
const playButton = document.querySelector('button');

playButton.addEventListener('click', function () {
	audio.play();
	alert('click');
});

const decoder = new BeatmapDecoder();
const map = await decoder.decodeFromString(osuMap);

console.log(map);
console.log(osuAudio);

const bpm = map.bpm;
const hits = map.hitObjects;
