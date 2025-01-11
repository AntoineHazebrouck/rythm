import { HitObject } from 'osu-classes';
import { UserHitResult } from './hits-handler';
import { KeyState } from './inputs/key-state';
import { KeyStatus } from './inputs/key-status';
import { Observer, Sender } from './utils/observer-pattern';
import { Volume } from './audio-handler';
import { Optional } from './utils/optional';

class KeySender implements Sender<KeyStatus> {
	public constructor(private readonly observers: Observer<KeyStatus>[]) {}

	attach(observer: Observer<KeyStatus>): void {
		this.observers.push(observer);
	}

	notify(modifiedData: KeyStatus): void {
		this.observers.forEach((observer) => observer.update(modifiedData));
	}
}

class VolumeSender implements Sender<Volume> {
	public constructor(private readonly observers: Observer<Volume>[]) {}

	attach(observer: Observer<number>): void {
		this.observers.push(observer);
	}

	notify(modifiedData: Volume): void {
		this.observers.forEach((observer) => observer.update(modifiedData));
	}
}

export class Store {
	private volume: Volume;
	private readonly keyStates: KeyStatus[];
	private readonly userHits: UserHitResult[];

	public readonly keySender: Sender<KeyStatus>;
	public readonly volumeSender: Sender<Volume>;

	public constructor(keyToColumnMapping: Record<string, number>) {
		this.keyStates = Object.entries(keyToColumnMapping).map(
			(mapping) => new KeyStatus(mapping[0], mapping[1], KeyState.UP)
		);

		this.userHits = [];
		this.keySender = new KeySender([]);
		this.volumeSender = new VolumeSender([]);
		this.volume = 0;
	}

	public setVolume(volume: Volume) {
		this.volume = volume;
		this.volumeSender.notify(volume);
	}

	public getKeyStates(): KeyStatus[] {
		return this.keyStates;
	}

	public getKeyState(key: string): KeyState {
		return this.keyStates.find((searchKey) => searchKey.key === key)!.state;
	}

	public addUserHit(userHitResult: UserHitResult) {
		this.userHits.push(userHitResult);
		// this.notify(new KeyStatus); TODO
	}

	public setKeyState(key: string, state: KeyState): void {
		Optional.of(
			this.keyStates.find((searchKey) => searchKey.key === key)
		).ifPresent((keyStatus) => {
			keyStatus.state = state;
			this.keySender.notify(keyStatus);
		});
	}

	public getColumnForKey(key: string) {
		return this.keyStates.find((keyStatus) => keyStatus.key === key)
			?.column;
	}

	public isAlreadyHit(hit: HitObject): boolean {
		return this.userHits.find((userHit) => userHit.actualHit === hit)
			? true
			: false;
	}
}
