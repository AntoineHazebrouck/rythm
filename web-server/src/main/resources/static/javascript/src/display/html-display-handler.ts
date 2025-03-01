import { HitResult } from 'osu-classes';

export class HtmlDisplayHandler {
	public constructor(
		private readonly noteRating: HTMLElement,
		private readonly error: HTMLElement
	) {}

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
			<div 
				class="alert ${
					resultToAlertMapping[rating]
						? resultToAlertMapping[rating]
						: 'alert-secondary'
				} mx-auto my-0 px-4 py-2" 
				role="alert"
				style="width: fit-content"
			>
				<h3 
					class="text-uppercase m-0"
					style="width: fit-content"
				>${HitResult[rating]}</h3>
			</div>
		`;
	}

	public displayError(error: Error): void {
		console.log(error);
		this.error.innerHTML = `
			<div class="alert alert-danger mx-auto" role="alert">${error.message}</div>
		`;
	}
}
