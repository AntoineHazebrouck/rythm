import audio from './audio.js';

export default function startSong() {
	audio.playbackRate = 0.5; // TODO remove
	audio.play();
}
