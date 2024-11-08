import { BeatmapDecoder } from 'osu-parsers';
import { HitsHandler } from './hits-handler';
import { addEventListeners } from './inputs-handler';
import { getParameter } from './parameters-handler';
import { DisplayHandler } from './display-handler';

const osuMap = await fetch(
	getParameter('beatmap-url').orElseThrow(
		new Error('Could not read note-spacing property')
	)
).then((data) => data.text());
const hitsHandler = new HitsHandler(
	new BeatmapDecoder().decodeFromString(osuMap)
);
const displayHandler = new DisplayHandler(
	hitsHandler,
	document.querySelector('canvas')!
);

addEventListeners(hitsHandler);
displayHandler.startDisplaying();
