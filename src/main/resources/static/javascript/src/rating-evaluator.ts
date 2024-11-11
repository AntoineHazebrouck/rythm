import { HitResult } from 'osu-classes';
import { AudioHandler } from './audio-handler';
import { HtmlDisplayHandler } from './display/html-display-handler';
import { HitsHandler } from './hits-handler';
import { KeyState } from './inputs/key-state';
import { KeyStatus } from './inputs/key-status';
import { Store } from './store';
import { Observer } from './utils/observer-pattern';

export class RatingEvaluator implements Observer<KeyStatus> {
	public constructor(
		private readonly audioHandler: AudioHandler,
		private readonly htmlDisplayHandler: HtmlDisplayHandler,
		private readonly hitsHandler: HitsHandler,
		private readonly store: Store
	) {}

	update(modifiedData: KeyStatus): void {

		console.log(modifiedData);
		
		if (
			modifiedData.key === ' ' &&
			modifiedData.state === KeyState.PRESSED // refactor, move to a new observer
		) {
			this.audioHandler.startSong();
		} else {
			this.hitsHandler
				.getResultFor(
					modifiedData.state,
					this.audioHandler.time(),
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
