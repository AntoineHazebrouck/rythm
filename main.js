import { BeatmapDecoder } from "osu-parsers";

const path = '../resources/osu/Tan Bionica - Ciudad Magica/map.osu';

// This is optional and true by default.
const shouldParseSb = true;

const decoder = new BeatmapDecoder();
const beatmap1 = await decoder.decodeFromPath(path, shouldParseSb);

console.log(beatmap1) // Beatmap object.