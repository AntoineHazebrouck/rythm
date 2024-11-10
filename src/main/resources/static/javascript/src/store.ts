import { HitObject } from 'osu-classes';
import { UserHitResult } from './hits-handler';

export enum KeyState {
	UP,
	PRESSED,
}

export class Store {
	private readonly keyStates: Record<string, KeyState>;
	private readonly keyToColumnMapping: Record<string, number>;
	private readonly userHits: UserHitResult[];

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
	}

	public getKeyStates(): Record<string, KeyState> {
		return this.keyStates;
	}

	public addUserHit(userHitResult: UserHitResult) {
		console.log(this);
		this.userHits.push(userHitResult);
	}

	public getKeyState(key: string): KeyState {
		return this.keyStates[key];
	}
	public setKeyState(key: string, state: KeyState): void {
		console.log(this);
		this.keyStates[key] = state;
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
