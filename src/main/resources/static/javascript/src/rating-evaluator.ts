import { HitObject, HitResult } from 'osu-classes';
import { HoldableObject } from 'osu-parsers';
import { startSong, time } from './audio';
import { HtmlDisplayHandler } from './display/html-display-handler';
import { HitsHandler, UserHitResult } from './hits-handler';
import { KeyState, ModificationType, Observer, Store } from './store';

export class RatingEvaluator implements Observer<Store> {
	private readonly htmlDisplayHandler: HtmlDisplayHandler;
	private readonly hitsHandler: HitsHandler;

	public constructor(
		htmlDisplayHandler: HtmlDisplayHandler,
		hitsHandler: HitsHandler
	) {
		this.htmlDisplayHandler = htmlDisplayHandler;
		this.hitsHandler = hitsHandler;
	}

	private buildUserHitResult(
		userHitTime: number,
		actualHit: HitObject
	): UserHitResult {
		const offset = actualHit.startTime - userHitTime;
		const rating =
			actualHit instanceof HoldableObject &&
			Math.abs(offset) <= actualHit.duration
				? HitResult.Perfect
				: actualHit.hitWindows.resultFor(offset);
		return new UserHitResult(actualHit, userHitTime, rating);
	}

	private handleKeyPressed(key: string, store: Store) {
		const columnId = store.getColumnForKey(key);

		const closestHit = this.hitsHandler.closestHit(columnId);
		const userHitResult = this.buildUserHitResult(time(), closestHit);

		console.log(userHitResult);
		
		this.htmlDisplayHandler.displayRating(userHitResult.rating);
		if (userHitResult.rating !== HitResult.None) {
			store.addUserHit(userHitResult);
		}
	}

	public update(store: Store, modificationType: ModificationType): void {
		if (modificationType === ModificationType.INPUTS) {
			if (store.getKeyState(' ') === KeyState.PRESSED) {
				startSong();
			}
			Object.entries(store.getKeyStates()).forEach((entry) => {
				const [key, state] = entry;
	
				if (state === KeyState.PRESSED) {
					this.handleKeyPressed(key, store);
				}
			});
		}
	}
}
