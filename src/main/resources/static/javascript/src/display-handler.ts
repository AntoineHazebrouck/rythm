import { HitResult } from 'osu-classes';
import { HoldableObject } from 'osu-parsers';
import { time } from './audio.js';
import { HitsHandler } from './hits-handler.js';
import { getParameter } from './parameters-handler.js';
import { store } from './store.js';

export class CanvasDisplayHandler {
	private readonly hitsHandler: HitsHandler;
	private readonly canvas: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;

	public constructor(hitsHandler: HitsHandler, canvas: HTMLCanvasElement) {
		this.hitsHandler = hitsHandler;
		this.canvas = canvas;
		this.context = canvas.getContext('2d')!;
	}

	private laneWidth(): number {
		return this.canvas.width / this.hitsHandler.columns().length;
	}

	private fitToScreen(): void {
		this.canvas.width = screen.width / 2;
		this.canvas.height = screen.height;
	}

	private drawNoteLimitLine(): void {
		this.context.beginPath();
		this.context.moveTo(0, 0);
		this.context.lineTo(this.canvas.width, 0);
		this.context.stroke();

		Object.entries(store.keyStates).forEach((entry) => {
			const [key, state] = entry;

			if (state === 'PRESSED') {
				this.context.fillStyle = 'red';
				const laneX = this.laneWidth() * store.keyToColumnMapping[key];

				this.context.beginPath();
				this.context.rect(laneX, 0, this.laneWidth(), 10);
				this.context.fill();

				this.context.fillStyle = 'black';
			}
		});
	}

	private draw(): void {
		this.fitToScreen();

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawNoteLimitLine();

		this.hitsHandler.nextHits().forEach((hit) => {
			function getDisplayedY(actualY: number) {
				const spacingRatio = Number(
					getParameter('note-spacing').orElseThrow(
						new Error('Could not read note-spacing property')
					)
				);
				return (actualY - time()) / spacingRatio;
			}

			this.context.beginPath();
			const laneX =
				this.laneWidth() *
				this.hitsHandler.columns().findIndex((x) => x === hit.startX);
			this.context.moveTo(laneX, getDisplayedY(hit.startTime));

			if (hit instanceof HoldableObject) {
				this.context.rect(
					laneX,
					getDisplayedY(hit.startTime),
					this.laneWidth(),
					getDisplayedY(hit.endTime) - getDisplayedY(hit.startTime)
				);
				this.context.fill();
			} else {
				this.context.lineTo(
					laneX + this.laneWidth(),
					getDisplayedY(hit.startTime)
				);
				this.context.stroke();
			}
		});
	}

	public startDisplaying(): void {
		this.draw();
		requestAnimationFrame(() => this.startDisplaying());
	}
}

export class HtmlDisplayHandler {
	private readonly hitsHandler: HitsHandler;
	private readonly noteRating: HTMLElement;

	public constructor(noteRating: HTMLElement, hitsHandler: HitsHandler) {
		this.noteRating = noteRating;
		this.hitsHandler = hitsHandler;
	}

	public displayRating(columnId: number): void {
		const hit = this.hitsHandler.closestHit(columnId);

		const offset = hit.startTime - time();

		const rating =
			hit instanceof HoldableObject && Math.abs(offset) <= hit.duration
				? HitResult[HitResult.Perfect]
				: HitResult[hit.hitWindows.resultFor(offset)];

		if (rating) this.noteRating.innerHTML = rating;
	}
}
