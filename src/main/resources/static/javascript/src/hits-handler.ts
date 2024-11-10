import { Beatmap, HitObject, HitResult } from 'osu-classes';
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

	public closestHit(columnId: number): HitObject {
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

	public pastHits(): HitObject[] {
		const data = this.hits.filter((hit) => {
			const start = hit.startTime;
			const duration = hit.hitWindows.windowFor(HitResult.Miss);
			const noteEnd: number = start + duration;

			return noteEnd < time();
		});
		return data;
	}

	public nextHits(): HitObject[] {
		return this.hits.filter((hit) => {
			if (hit instanceof HoldableObject) {
				return hit.endTime > time();
			} else {
				return hit.startTime > time();
			}
		});
	}
}
