import { KeyState } from './inputs/key-state';
import { KeyStatus } from './inputs/key-status';
import { Observer } from './utils/observer-pattern';

export type Volume = number;

export class AudioHandler implements Observer<Volume | KeyStatus> {
	public constructor(private readonly audio: HTMLAudioElement) {}

	update(modifiedData: Volume | KeyStatus): void {
		if (modifiedData instanceof KeyStatus) {
			if (modifiedData.key === ' ' &&
				modifiedData.state === KeyState.PRESSED) {
					this.audio.play();
				}
		} else {
			this.audio.volume = modifiedData;
		}
	}

	public time(): number {
		return Math.round(this.audio.currentTime * 1000);
	}
}
