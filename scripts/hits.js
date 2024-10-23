import osuMap from '../resources/osu/Tan Bionica - Ciudad Magica/map.osu';
import { BeatmapDecoder } from 'osu-parsers';
import time from './time';

const hits = await new BeatmapDecoder()
	.decodeFromString(osuMap)
	.hitObjects.sort((left, right) => left - right);

export function closestHit() {
	const closestHits = hits.sort(
		(left, right) =>
			Math.abs(left.startTime - time()) -
			Math.abs(right.startTime - time())
	);

	return closestHits[0];
}

export function nextHits() {
	return hits.filter((hit) => hit.startTime > time());
}
