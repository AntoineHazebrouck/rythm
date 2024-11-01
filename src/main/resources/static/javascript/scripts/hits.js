import { getParameter } from './parameters-handler.js';
import time from './time.js';
import { BeatmapDecoder } from 'osu-parsers';

const osuMap = await fetch(getParameter('beatmap-url')).then(data => data.text())

const parsed = await new BeatmapDecoder()
	.decodeFromString(osuMap)

console.log(parsed);


const hits = parsed
	.hitObjects.sort((left, right) => left - right);


export const columns = Array.from(new Set(hits.map(hit => hit.startX))).sort((left, right) => left - right);

console.log(columns);


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
