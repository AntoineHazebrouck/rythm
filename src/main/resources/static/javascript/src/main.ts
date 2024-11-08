import { BeatmapDecoder } from 'osu-parsers';
import { HitsHandler } from './hits-handler';
import { addEventListeners } from './inputs-handler';
import { getParameter } from './parameters-handler';
import { DisplayHandler } from './display-handler';
import { displayError } from './error-handler';

try {
	const osuMap = await fetch(
		getParameter('beatmap-url').orElseThrow(
			new Error('Could not read note-spacing property')
		)
	).then((response) => {
		if (response.ok) return response.text();
		else throw new Error(`HTTP ${response.status} for ${response.url}`);
	});

	const hitsHandler = new HitsHandler(
		new BeatmapDecoder().decodeFromString(osuMap)
	);
	const displayHandler = new DisplayHandler(
		hitsHandler,
		document.querySelector('canvas')!
	);

	addEventListeners(hitsHandler);
	displayHandler.startDisplaying();
} catch (error) {
	displayError(error);
}
