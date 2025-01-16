import { Beatmap, HitObject, HitResult } from 'osu-classes';
import { HoldableObject } from 'osu-parsers';
import { AudioHandler } from './audio-handler';
import { KeyState } from './inputs/key-state';
import { Store } from './store';
import { Optional } from './utils/optional';

export class UserHitResult {
	public constructor(
		public readonly actualHit: HitObject,
		public readonly userHitTime: number,
		public readonly rating: HitResult
	) {}
}

export class HitsHandler {
	private readonly audioHandler: AudioHandler;
	private readonly hits: HitObject[];
	private readonly store: Store;

	public constructor(
		beatmap: Beatmap,
		store: Store,
		audioHandler: AudioHandler
	) {
		this.audioHandler = audioHandler;
		this.store = store;
		this.hits = beatmap.hitObjects.sort(
			(left, right) => left.startTime - right.startTime
		);
	}

	public columns(): number[] {
		return Array.from(new Set(this.hits.map((hit) => hit.startX))).sort(
			(left, right) => left - right
		);
	}

	public firstHit(): HitObject {
		return this.hits[0];
	}

	// allows the boxing of missed (not hit by the user) notes in the store
	public pastHits(): HitObject[] {
		const data = this.hits.filter((hit) => {
			const start = hit.startTime;
			const duration = hit.hitWindows.windowFor(HitResult.Miss);
			const noteEnd: number = start + duration;

			return noteEnd < this.audioHandler.time();
		});
		return data;
	}

	// allows the displaying of all next notes
	public nextHits(): HitObject[] {
		return this.hits.filter((hit) => {
			if (hit instanceof HoldableObject) {
				return hit.endTime > this.audioHandler.time();
			} else {
				return hit.startTime > this.audioHandler.time();
			}
		});
	}

	private holdables(columnId: number): HoldableObject[] {
		return this.hits
			.filter((hit) => hit.startX === this.columns()[columnId])
			.filter((hit) => hit instanceof HoldableObject);
	}

	private closestHit(columnId: number): Optional<HitObject> {
		const closestHits = this.hits
			.filter((hit) => !this.store.isAlreadyHit(hit))
			.filter((hit) => hit.startX === this.columns()[columnId])
			.sort((left, right) => {
				const leftOffset =
					(left instanceof HoldableObject
						? left.endTime
						: left.startTime) - this.audioHandler.time();
				const rightOffset =
					(right instanceof HoldableObject
						? right.endTime
						: right.startTime) - this.audioHandler.time();

				return Math.abs(leftOffset) - Math.abs(rightOffset);
			});

		return Optional.of(closestHits[0]);
	}

	public getResultFor(
		keyState: KeyState,
		userHitTime: number,
		onColumn: number
	): Optional<UserHitResult> {
		const holdable = this.holdables(onColumn).find(
			(holdable) =>
				holdable.startTime <= userHitTime &&
				holdable.endTime >= userHitTime
		);
		if (holdable) {
			if (keyState === KeyState.PRESSED) {
				return Optional.of(
					new UserHitResult(holdable, userHitTime, HitResult.Perfect)
				);
			} else {
				return Optional.of(
					new UserHitResult(holdable, userHitTime, HitResult.Miss)
				);
			}
		} else {
			if (keyState === KeyState.PRESSED) {
				return this.closestHit(onColumn).map((closestHit) => {
					const offset = closestHit.startTime - userHitTime;
					const rating = closestHit.hitWindows.resultFor(offset);
					return new UserHitResult(closestHit, userHitTime, rating);
				});
			} else {
				return Optional.empty();
			}
		}
	}
}
