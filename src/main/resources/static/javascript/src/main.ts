import { BeatmapDecoder } from 'osu-parsers';
import { CanvasDisplayHandler, HtmlDisplayHandler } from './display-handler';
import { ErrorHandler } from './error-handler';
import { HitsHandler } from './hits-handler';
import { addEventListeners } from './inputs-handler';
import { getParameter } from './parameters-handler';
import { Store } from './store';

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

	addEventListeners(hitsHandler, htmlDisplayHandler, store);
	canvasDisplayHandler.startDisplaying();
} catch (error) {
	errorHandler.displayError(error);
}
