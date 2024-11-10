export const audio = new Audio("/audio");

export function startSong() {
	audio.playbackRate = 0.5; // TODO remove
	audio.play();
}

export function time(): number {
	return Math.round(audio.currentTime * 1000);
}