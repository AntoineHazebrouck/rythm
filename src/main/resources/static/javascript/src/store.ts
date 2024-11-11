import { HitObject } from 'osu-classes';
import { UserHitResult } from './hits-handler';
import { KeyState } from './inputs/key-state';
import { KeyStatus } from './inputs/key-status';
import { Observer, Sender } from './utils/observer-pattern';
import { Volume } from './audio-handler';

// type Sendable = KeyStatus | Volume;

export class Store implements Sender<Volume>, Sender<KeyStatus> {
	private volume: Volume;
	private readonly keyStates: KeyStatus[];
	private readonly keyToColumnMapping: Record<string, number>;
	private readonly userHits: UserHitResult[];

	public readonly observers: Observer<Volume | KeyStatus>[];

	public constructor(keyToColumnMapping: Record<string, number>) {
		this.keyStates = [
			new KeyStatus('a', KeyState.UP),
			new KeyStatus('z', KeyState.UP),
			new KeyStatus('e', KeyState.UP),
			new KeyStatus('r', KeyState.UP),
			new KeyStatus('t', KeyState.UP),
			new KeyStatus(' ', KeyState.UP),
		];
		this.keyToColumnMapping = keyToColumnMapping;
		this.userHits = [];
		this.observers = [];
		this.volume = 0;
	}

	notify(modifiedData: number | KeyStatus): void {
		this.observers.forEach((observer) => observer.update(modifiedData));
	}


	// notify(modifiedData: Sendable): void {
	// 	this.observers.forEach((observer) => observer.update(modifiedData));
	// }

	public setVolume(volume: Volume) {
		this.volume = volume;
		this.notify(volume);
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
		const newKeyStatus = new KeyStatus(key, state);
		this.keyStates[
			this.keyStates.findIndex((searchKey) => searchKey.key === key)
		] = newKeyStatus;
		this.notify(newKeyStatus);
	}

	public getColumnForKey(key: string) {
		return this.keyToColumnMapping[key];
	}

	public isAlreadyHit(hit: HitObject): boolean {
		return this.userHits.find((userHit) => userHit.actualHit === hit)
			? true
			: false;
	}
}
