export class AudioHandler {
	public constructor(private readonly audio: HTMLAudioElement) {}

	public startSong(): void {
		this.audio.play();
	}

	public time(): number {
		return Math.round(this.audio.currentTime * 1000);
	}

	public setVolume(volume: number): void {
		this.audio.volume = volume;
	}
}
