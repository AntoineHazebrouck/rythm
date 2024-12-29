import { HitResult } from 'osu-classes';
import { BeatmapDecoder } from 'osu-parsers';
import { AudioHandler } from './audio-handler';
import { CanvasDisplayHandler } from './display/canvas-display-handler';
import { HtmlDisplayHandler } from './display/html-display-handler';
import { Gameloop } from './gameloop';
import { HitsHandler } from './hits-handler';
import { addEventListeners } from './inputs/inputs-handler';
import { RatingEvaluator } from './rating-evaluator';
import { Store } from './store';
import { TimedEventsHandler } from './timed-events-handler';
import { getParameter } from './inputs/parameters-handler';

const store = new Store({
	a: 0,
	z: 1,
	e: 2,
	r: 3,
	t: 4,
});

const htmlDisplayHandler = new HtmlDisplayHandler(
	document.querySelector('#note-rating')!,
	document.querySelector('#error-message')!
);
htmlDisplayHandler.displayRating(HitResult.None);

const audioHandler = new AudioHandler(
	new Audio(
		`/game/audio?archive-code=${getParameter(
			'archive-code'
		).orElseThrow(
			new Error('Could not read archive-code property')
		)}`
	)
);

try {
	const osuMap = await fetch(
		`/game/beatmap?archive-code=${getParameter(
			'archive-code'
		).orElseThrow(
			new Error('Could not read archive-code property')
		)}&encoded-difficulty=${getParameter(
			'encoded-difficulty'
		).orElseThrow(
			new Error('Could not read encoded-difficulty property')
		)}`
	).then((response) => {
		if (response.ok) return response.text();
		else throw new Error(`HTTP ${response.status} for ${response.url}`);
	});

	const hitsHandler = new HitsHandler(
		new BeatmapDecoder().decodeFromString(osuMap),
		store,
		audioHandler
	);

	const ratingEvaluator = new RatingEvaluator(
		audioHandler,
		htmlDisplayHandler,
		hitsHandler,
		store
	);

	const canvasDisplayHandler = new CanvasDisplayHandler(
		store,
		hitsHandler,
		audioHandler,
		document.querySelector('canvas')!
	);

	const timedEventsHandler = new TimedEventsHandler(
		htmlDisplayHandler,
		hitsHandler,
		store
	);

	store.keySender.attach(ratingEvaluator);
	store.keySender.attach(audioHandler);
	store.volumeSender.attach(audioHandler);

	addEventListeners(store, document.querySelector('#volume')!);

	const gameloop = new Gameloop(canvasDisplayHandler, timedEventsHandler);
	gameloop.loop();
} catch (error) {
	htmlDisplayHandler.displayError(error);
}
