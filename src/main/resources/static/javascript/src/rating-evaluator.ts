import { HitResult } from 'osu-classes';
import { startSong, time } from './audio';
import { HtmlDisplayHandler } from './display/html-display-handler';
import { HitsHandler } from './hits-handler';
import { KeyState } from './inputs/key-state';
import { KeyStatus } from './inputs/key-status';
import { Observer } from './utils/observer-pattern';
import { Store } from './store';

export class RatingEvaluator implements Observer<KeyStatus> {
	public constructor(
		private readonly htmlDisplayHandler: HtmlDisplayHandler,
		private readonly hitsHandler: HitsHandler,
		private readonly store: Store
	) {}

	update(modifiedData: KeyStatus): void {
		if (
			modifiedData.key === ' ' &&
			modifiedData.state === KeyState.PRESSED
		) {
			startSong();
		} else {
			this.hitsHandler
				.getResultFor(
					modifiedData.state,
					time(),
					this.store.getColumnForKey(modifiedData.key)
				)
				.ifPresent((result) => {
					if (result.rating !== HitResult.None) {
						this.htmlDisplayHandler.displayRating(result.rating);
						this.store.addUserHit(result);
					}
				});
		}
	}
}
