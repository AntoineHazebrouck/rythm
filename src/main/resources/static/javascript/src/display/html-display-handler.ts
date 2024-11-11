import { HitResult } from 'osu-classes';

export class HtmlDisplayHandler {
	public constructor(private readonly noteRating: HTMLElement) {}

	public displayRating(rating: HitResult): void {
		const resultToAlertMapping = {
			[HitResult.Perfect]: 'alert-success',
			[HitResult.Great]: 'alert-success',
			[HitResult.Good]: 'alert-success',
			[HitResult.Ok]: 'alert-warning',
			[HitResult.Meh]: 'alert-warning',
			[HitResult.Miss]: 'alert-danger',
		};
		this.noteRating.innerHTML = `
			<div class="alert ${
				resultToAlertMapping[rating]
					? resultToAlertMapping[rating]
					: 'alert-secondary'
			} col-4 m-3 mx-auto" role="alert">
				<h1 class="text-center">${rating}</h1>
			</div>
		`;
	}
}
