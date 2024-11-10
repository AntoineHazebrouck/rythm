import { HitObject, HitResult } from 'osu-classes';
import { HoldableObject } from 'osu-parsers';
import { startSong, time } from './audio.js';
import { HtmlDisplayHandler } from './display-handler.js';
import { HitsHandler, UserHit } from './hits-handler.js';
import { KeyState, Store } from './store.js';

export function addEventListeners(
	hitsHandler: HitsHandler,
	htmlDisplayHandler: HtmlDisplayHandler,
	store: Store
) {
	function buildUserHitResult(
		userHitTime: number,
		actualHit: HitObject
	): UserHit {
		const offset = actualHit.startTime - userHitTime;
		const rating =
			actualHit instanceof HoldableObject &&
			Math.abs(offset) <= actualHit.duration
				? HitResult.Perfect
				: actualHit.hitWindows.resultFor(offset);
		return new UserHit(actualHit, userHitTime, rating);
	}

	function handleKeyPressed(key: string) {
		const columnId = store.getColumnForKey(key);

		const closestHit = hitsHandler.closestHit(columnId);
		const userHitResult = buildUserHitResult(time(), closestHit);

		htmlDisplayHandler.displayRating(userHitResult.rating);
		if (userHitResult.rating !== HitResult.None) {
			store.addUserHit(userHitResult);
		}
	}

	const keyEvents: Record<string, () => void> = {
		a: () => handleKeyPressed('a'),
		z: () => handleKeyPressed('z'),
		e: () => handleKeyPressed('e'),
		r: () => handleKeyPressed('r'),
		t: () => handleKeyPressed('t'),
		' ': startSong,
	};

	document.addEventListener('keydown', (event) => {
		event.preventDefault();

		if (
			store.getKeyState(event.key) === KeyState.UP ||
			hitsHandler.closestHit(store.getColumnForKey(event.key)) instanceof
				HoldableObject
		) {
			keyEvents[event.key]();
			store.setKeyState(event.key, KeyState.PRESSED);
		}
	});

	document.addEventListener('keyup', (event) => {
		event.preventDefault();

		store.setKeyState(event.key, KeyState.UP);
	});
}
