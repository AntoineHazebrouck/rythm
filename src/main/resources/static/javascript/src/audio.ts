export const audio = new Audio("/audio");

export function startSong() {
	audio.play();
}

export function time(): number {
	return Math.round(audio.currentTime * 1000);
}