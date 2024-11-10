import { HitObject } from 'osu-classes';
import { UserHitResult } from './hits-handler';

export interface Observer<T> {
	// Receive update from subject.
	update(subject: T, modificationType: ModificationType): void;
}

export enum ModificationType {
	INPUTS,
	USER_HITS
}

export interface Subject {
	// Notify all observers about an event.
	notify(modificationType: ModificationType): void;
}

export enum KeyState {
	UP,
	PRESSED,
}

export class Store implements Subject {
	private readonly keyStates: Record<string, KeyState>;
	private readonly keyToColumnMapping: Record<string, number>;
	private readonly userHits: UserHitResult[];

	public readonly observers: Observer<Store>[];

	public constructor(keyToColumnMapping: Record<string, number>) {
		this.keyStates = {
			a: KeyState.UP,
			z: KeyState.UP,
			e: KeyState.UP,
			r: KeyState.UP,
			t: KeyState.UP,
		};
		this.keyToColumnMapping = keyToColumnMapping;
		this.userHits = [];
		this.observers = [];
	}

	public notify(modificationType: ModificationType): void {
		this.observers.forEach((observer) => observer.update(this, modificationType));
	}

	public getKeyStates(): Record<string, KeyState> {
		return this.keyStates;
	}

	public getKeyState(key: string): KeyState {
		return this.keyStates[key];
	}

	public addUserHit(userHitResult: UserHitResult) {
		this.userHits.push(userHitResult);
		console.log(this);
		this.notify(ModificationType.USER_HITS);
	}

	public setKeyState(key: string, state: KeyState): void {
		this.keyStates[key] = state;
		console.log(this);
		this.notify(ModificationType.INPUTS);
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
