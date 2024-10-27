import time from './time.js';
import { BeatmapDecoder } from 'osu-parsers';

const search = window.location.search;
const urlParams = new URLSearchParams(search);

const osuMap = await fetch(urlParams.get('beatmap-url')).then(data => data.text())

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
