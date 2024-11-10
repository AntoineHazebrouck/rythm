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

	public update(store: Store, modificationType: ModificationType): void {
		if (modificationType === ModificationType.INPUTS) {
			if (store.getKeyState(' ') === KeyState.PRESSED) {
				startSong();
			}
			Object.entries(store.getKeyStates()).forEach((entry) => {
				const [key, state] = entry;

				if (state === KeyState.PRESSED) {
					const result = this.hitsHandler.getResultFor(
						time(),
						store.getColumnForKey(key)
					);

					this.htmlDisplayHandler.displayRating(result.rating);
					if (result.rating !== HitResult.None) {
						store.addUserHit(result);
					}
				}
			});
		}
	}
}
