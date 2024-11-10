import { Beatmap, HitObject, HitResult, HitType } from 'osu-classes';
import { HoldableObject } from 'osu-parsers';
import { time } from './audio.js';
import { Store } from './store.js';

export class UserHitResult {
	public readonly actualHit: HitObject;
	public readonly userHitTime: number;
	public readonly rating: HitResult;

	public constructor(
		actualHit: HitObject,
		userHitTime: number,
		rating: HitResult
	) {
		this.actualHit = actualHit;
		this.userHitTime = userHitTime;
		this.rating = rating;
	}
}

export class HitsHandler {
	private readonly hits: HitObject[];
	private readonly store: Store;

	public constructor(beatmap: Beatmap, store: Store) {
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

	// allows the boxing of missed (not hit by the user) notes in the store
	public pastHits(): HitObject[] {
		const data = this.hits.filter((hit) => {
			const start = hit.startTime;
			const duration = hit.hitWindows.windowFor(HitResult.Miss);
			const noteEnd: number = start + duration;

			return noteEnd < time();
		});
		return data;
	}

	// allows the displaying of all next notes
	public nextHits(): HitObject[] {
		return this.hits.filter((hit) => {
			if (hit instanceof HoldableObject) {
				return hit.endTime > time();
			} else {
				return hit.startTime > time();
			}
		});
	}

	private holdables(): HoldableObject[] {
		return this.hits.filter((hit) => hit instanceof HoldableObject);
	}

	private closestHit(columnId: number): HitObject {
		const closestHits = this.hits
			.filter((hit) => !this.store.isAlreadyHit(hit))
			.filter((hit) => hit.startX === this.columns()[columnId])
			.sort((left, right) => {
				const leftOffset =
					(left instanceof HoldableObject
						? left.endTime
						: left.startTime) - time();
				const rightOffset =
					(right instanceof HoldableObject
						? right.endTime
						: right.startTime) - time();

				return Math.abs(leftOffset) - Math.abs(rightOffset);
			});

		return closestHits[0];
	}

	public getResultFor(userHitTime: number, onColumn: number): UserHitResult {
		// si le temps est dans un holdable alors Perfect
		const holdable = this.holdables().find(
			(holdable) =>
				holdable.startTime <= userHitTime &&
				holdable.endTime >= userHitTime
		);
		if (holdable) {
			return new UserHitResult(holdable, userHitTime, HitResult.Perfect);
		} else {
			const closestHit = this.closestHit(onColumn);

			const offset = closestHit.startTime - userHitTime;
			const rating = closestHit.hitWindows.resultFor(offset);
			return new UserHitResult(closestHit, userHitTime, rating);
		}
	}
}
