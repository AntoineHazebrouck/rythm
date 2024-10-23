import { BeatmapDecoder } from 'osu-parsers';
import osuMap from './resources/osu/Tan Bionica - Ciudad Magica/map.osu';

// const path = 'resources/osu/Tan Bionica - Ciudad Magica/map.osu';

console.log(osuMap);

const decoder = new BeatmapDecoder();
const beatmap1 = await decoder.decodeFromString(osuMap);

console.log(beatmap1); // Beatmap object.
// console.log(osuMap); // Beatmap object.
