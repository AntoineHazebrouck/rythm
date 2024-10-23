import audio from './audio';

export default function time() {
	return Math.round(audio.currentTime * 1000);
}
