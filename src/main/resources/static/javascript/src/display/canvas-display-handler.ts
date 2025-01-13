import { HoldableObject } from 'osu-parsers';
import Two from 'two.js';
import { RoundedRectangle } from 'two.js/src/shapes/rounded-rectangle';
import { AudioHandler } from '../audio-handler.js';
import { HitsHandler } from '../hits-handler.js';
import { KeyState } from '../inputs/key-state.js';
import { KeyStatus } from '../inputs/key-status.js';
import { getParameter } from '../inputs/parameters-handler.js';
import { Store } from '../store.js';

export class CanvasDisplayHandler {
	private readonly store: Store;
	private readonly hitsHandler: HitsHandler;
	private readonly audioHandler: AudioHandler;
	private readonly renderer: Two;

	private readonly noteKeysRectangles: Map<KeyStatus, RoundedRectangle>;

	public constructor(
		store: Store,
		hitsHandler: HitsHandler,
		audioHandler: AudioHandler,
		canvas: HTMLCanvasElement
	) {
		this.store = store;
		this.hitsHandler = hitsHandler;
		this.audioHandler = audioHandler;

		this.renderer = new Two({
			type: Two.Types.webgl,
			domElement: canvas,
		});

		this.noteKeysRectangles = new Map();
		this.store.getKeyStates().forEach((status) => {
			const laneX =
				this.laneWidth() * this.store.getColumnForKey(status.key);
			const rectangle = this.renderer.makeRoundedRectangle(
				laneX,
				0,
				this.laneWidth(),
				10,
				5
			);
			rectangle.fill = 'red';
			// rectangle.visible = false;
			this.noteKeysRectangles.set(status, rectangle);
		});

		this.renderer.bind('update', () => this.draw());
		this.renderer.play();
	}

	private laneWidth(): number {
		return this.renderer.width / this.hitsHandler.columns().length;
	}

	private fitToScreen(): void {
		this.renderer.width = screen.width / 2;
		this.renderer.height = screen.height;
	}

	private drawNoteLimitLine(): void {
		this.renderer.makeLine(0, 0, this.renderer.width, 0);

		Array.from(this.noteKeysRectangles.keys()).forEach((status) => {
			console.log(status);
			
			if (status.state === KeyState.PRESSED) {
				console.log('qsdsqfqsfqsfqsf');

				this.noteKeysRectangles.get(status)!.visible = true;
			}
		});
	}

	private drawNotes(): void {
		this.hitsHandler.nextHits().forEach((hit) => {
			if (this.getDisplayedY(hit.startTime) > this.renderer.height)
				return;

			const laneX =
				this.laneWidth() *
				this.hitsHandler.columns().findIndex((x) => x === hit.startX);

			if (hit instanceof HoldableObject) {
				const rectangle = this.renderer.makeRoundedRectangle(
					laneX,
					this.getDisplayedY(hit.startTime),
					this.laneWidth(),
					this.getDisplayedY(hit.endTime) -
						this.getDisplayedY(hit.startTime),
					5
				);
			} else {
				const start = this.getDisplayedY(hit.startTime - 1);
				const end = this.getDisplayedY(hit.startTime + 1);
				this.renderer.makeRoundedRectangle(
					laneX,
					start,
					this.laneWidth(),
					end - start,
					5
				);
			}
		});
	}

	private getDisplayedY(actualY: number): number {
		const spacingRatio = Number(
			getParameter('notes-spacing').orElseThrow(
				new Error('Could not read notes-spacing property')
			)
		);
		return (actualY - this.audioHandler.time()) / spacingRatio;
	}

	public draw(): void {
		this.fitToScreen();

		this.renderer.clear();

		this.drawNotes();

		this.drawNoteLimitLine();
	}
}
