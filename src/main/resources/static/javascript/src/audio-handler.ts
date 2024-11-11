import { Observer } from './utils/observer-pattern';

export type Volume = number;

export class AudioHandler implements Observer<Volume> {
	public constructor(private readonly audio: HTMLAudioElement) {}

	update(modifiedData: Volume): void {
		this.audio.volume = modifiedData;
	}

	public startSong(): void {
		this.audio.play();
	}

	public time(): number {
		return Math.round(this.audio.currentTime * 1000);
	}
}
