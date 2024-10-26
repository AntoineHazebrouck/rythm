import audio from './audio.js';

export default function time() {
	return Math.round(audio.currentTime * 1000);
}
