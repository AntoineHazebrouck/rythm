import time from './time.js';
import { BeatmapDecoder } from '../node_modules/osu-parsers/lib/browser.mjs';

const osuMap = await fetch("/beatmap")

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
