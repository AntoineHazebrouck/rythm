import { getParameter } from './parameters-handler.js';
import { time } from './audio.js';
import { BeatmapDecoder, HittableObject, HoldableObject } from 'osu-parsers';
import { Beatmap, HitObject } from 'osu-classes';

export class HitsHandler {
	private readonly hits: HitObject[];

	public constructor(beatmap: Beatmap) {
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

