import { HoldableObject } from 'osu-parsers';
import { HitsHandler } from '../hits-handler.js';
import { Store } from '../store.js';
import { KeyState } from '../inputs/key-state.js';
import { AudioHandler } from '../audio-handler.js';
import { getParameter } from '../inputs/parameters-handler.js';

export class CanvasDisplayHandler {
	private readonly store: Store;
	private readonly hitsHandler: HitsHandler;
	private readonly audioHandler: AudioHandler;
	private readonly canvas: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;

	public constructor(
		store: Store,
		hitsHandler: HitsHandler,
		audioHandler: AudioHandler,
		canvas: HTMLCanvasElement
	) {
		this.store = store;
		this.hitsHandler = hitsHandler;
		this.audioHandler = audioHandler;
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

		this.store.getKeyStates().forEach((status) => {
			if (status.state === KeyState.PRESSED) {
				this.context.fillStyle = 'red';
				const laneX =
					this.laneWidth() * this.store.getColumnForKey(status.key);

				this.context.beginPath();
				this.context.rect(laneX, 0, this.laneWidth(), 10);
				this.context.fill();

				this.context.fillStyle = 'black';
			}
		});
	}

	private getDisplayedY(actualY: number): number {
		const spacingRatio = Number(
			getParameter('note-spacing').orElseThrow(
				new Error('Could not read note-spacing property')
			)
		);
		return (actualY - this.audioHandler.time()) / spacingRatio;
	}

	public draw(): void {
		this.fitToScreen();

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.hitsHandler.nextHits().forEach((hit) => {
			this.context.beginPath();
			const laneX =
				this.laneWidth() *
				this.hitsHandler.columns().findIndex((x) => x === hit.startX);
			this.context.moveTo(laneX, this.getDisplayedY(hit.startTime));

			if (hit instanceof HoldableObject) {
				this.context.rect(
					laneX,
					this.getDisplayedY(hit.startTime),
					this.laneWidth(),
					this.getDisplayedY(hit.endTime) -
						this.getDisplayedY(hit.startTime)
				);
			} else {
				const start = this.getDisplayedY(hit.startTime - 5);
				const end = this.getDisplayedY(hit.startTime + 5);
				this.context.rect(laneX, start, this.laneWidth(), end - start);
			}
			this.context.fill();
		});
		this.drawNoteLimitLine();
	}
}
