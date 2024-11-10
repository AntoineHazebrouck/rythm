import { BeatmapDecoder } from 'osu-parsers';
import { CanvasDisplayHandler } from './display/canvas-display-handler';
import { ErrorHandler } from './error-handler';
import { Gameloop } from './gameloop';
import { HitsHandler } from './hits-handler';
import { addEventListeners } from './inputs-handler';
import { getParameter } from './parameters-handler';
import { Store } from './store';
import { HtmlDisplayHandler } from './display/html-display-handler';
import { TimedEventsHandler } from './timed-events-handler';

const errorHandler = new ErrorHandler(
	document.querySelector('#error-message')!
);

const store = new Store({
	a: 0,
	z: 1,
	e: 2,
	r: 3,
	t: 4,
});

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
		new BeatmapDecoder().decodeFromString(osuMap),
		store
	);
	const canvasDisplayHandler = new CanvasDisplayHandler(
		store,
		hitsHandler,
		document.querySelector('canvas')!
	);
	const htmlDisplayHandler = new HtmlDisplayHandler(
		document.querySelector('#note-rating')!
	);
	const timedEventsHandler = new TimedEventsHandler(
		htmlDisplayHandler,
		hitsHandler,
		store
	);

	addEventListeners(hitsHandler, htmlDisplayHandler, store);

	const gameloop = new Gameloop(canvasDisplayHandler, timedEventsHandler);
	gameloop.loop();
} catch (error) {
	errorHandler.displayError(error);
}
