import { BeatmapDecoder } from 'osu-parsers';
import { CanvasDisplayHandler, HtmlDisplayHandler } from './display-handler';
import { ErrorHandler } from './error-handler';
import { HitsHandler } from './hits-handler';
import { addEventListeners } from './inputs-handler';
import { getParameter } from './parameters-handler';

const errorHandler = new ErrorHandler(
	document.querySelector('#error-message')!
);

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
	const canvasDisplayHandler = new CanvasDisplayHandler(
		hitsHandler,
		document.querySelector('canvas')!
	);
	const htmlDisplayHandler = new HtmlDisplayHandler(
		document.querySelector('#note-rating')!,
		hitsHandler
	);

	addEventListeners(hitsHandler, canvasDisplayHandler, htmlDisplayHandler);
	canvasDisplayHandler.startDisplaying();
} catch (error) {
	errorHandler.displayError(error);
}
