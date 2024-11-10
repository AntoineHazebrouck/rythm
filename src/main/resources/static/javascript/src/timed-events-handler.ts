import { HitResult } from 'osu-classes';
import { HitsHandler, UserHitResult } from './hits-handler';
import { Store } from './store';
import { HtmlDisplayHandler } from './display/html-display-handler';

export class TimedEventsHandler {
	private readonly htmlDisplayHandler: HtmlDisplayHandler;
	private readonly hitsHandler: HitsHandler;
	private readonly store: Store;

	public constructor(
		htmlDisplayHandler: HtmlDisplayHandler,
		hitsHandler: HitsHandler,
		store: Store
	) {
		this.htmlDisplayHandler = htmlDisplayHandler;
		this.hitsHandler = hitsHandler;
		this.store = store;
	}

	public transferUnhitNotesAsMisses(): void {
		this.hitsHandler.pastHits().forEach((hit) => {
			if (!this.store.isAlreadyHit(hit)) {
				this.store.addUserHit(
					new UserHitResult(hit, -1, HitResult.Miss)
				);
				this.htmlDisplayHandler.displayRating(HitResult.Miss);
			}
		});
	}
}
