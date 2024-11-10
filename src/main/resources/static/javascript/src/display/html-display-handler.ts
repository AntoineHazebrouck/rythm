import { HitResult } from 'osu-classes';

export class HtmlDisplayHandler {
	private readonly noteRating: HTMLElement;

	public constructor(noteRating: HTMLElement) {
		this.noteRating = noteRating;
	}

	public displayRating(rating: HitResult): void {
		this.noteRating.innerHTML = HitResult[rating];
	}
}
