import { HitObject } from 'osu-classes';
import { HoldableObject } from 'osu-parsers';
import Two from 'two.js';
import { RoundedRectangle } from 'two.js/src/shapes/rounded-rectangle';
import { AudioHandler } from '../audio-handler.js';
import { HitsHandler } from '../hits-handler.js';
import { KeyState } from '../inputs/key-state.js';
import { getParameter } from '../inputs/parameters-handler.js';
import { Store } from '../store.js';

export class CanvasDisplayHandler {
	private static readonly DEFAULT_RECTANGLE_HEIGHT = 5;
	private static readonly RECTANGLE_RADIUS = 5;

	private readonly store: Store;
	private readonly hitsHandler: HitsHandler;
	private readonly audioHandler: AudioHandler;
	private readonly renderer: Two;

	private readonly userKeyInputsIndicators: Map<string, RoundedRectangle>;
	private readonly notes: Map<HitObject, RoundedRectangle>;

	public constructor(
		store: Store,
		hitsHandler: HitsHandler,
		audioHandler: AudioHandler,
		canvas: HTMLDivElement
	) {
		this.store = store;
		this.hitsHandler = hitsHandler;
		this.audioHandler = audioHandler;

		this.renderer = new Two({
			// type: Two.Types.webgl,
			fitted: true,
		}).appendTo(canvas);

		this.notes = new Map();
		this.hitsHandler.nextHits().forEach((hit) => {
			const rectangleHeight =
				hit instanceof HoldableObject
					? this.getDisplayedY(hit.endTime) -
					  this.getDisplayedY(hit.startTime)
					: CanvasDisplayHandler.DEFAULT_RECTANGLE_HEIGHT;

			const rectangle = this.renderer.makeRoundedRectangle(
				this.laneX(
					this.hitsHandler
						.columns()
						.findIndex((x) => x === hit.startX)
				),
				0,
				this.laneWidth(),
				rectangleHeight,
				CanvasDisplayHandler.RECTANGLE_RADIUS
			);
			rectangle.fill = 'blue';

			this.notes.set(hit, rectangle);
		});

		this.userKeyInputsIndicators = new Map(
			this.store.getKeyStates().map((status) => {
				const rectangle = this.renderer.makeRoundedRectangle(
					this.laneX(this.store.getColumnForKey(status.key)),
					0 + CanvasDisplayHandler.DEFAULT_RECTANGLE_HEIGHT,
					this.laneWidth(),
					CanvasDisplayHandler.DEFAULT_RECTANGLE_HEIGHT,
					CanvasDisplayHandler.RECTANGLE_RADIUS
				);

				rectangle.fill = 'red';
				rectangle.visible = false;
				return [status.key, rectangle];
			})
		);

		this.renderer.bind('update', () => {
			this.draw();
		});
		this.renderer.play();
	}

	private laneWidth(): number {
		return this.renderer.width / this.hitsHandler.columns().length;
	}

	private laneX(columnIndex: number): number {
		const laneX = this.laneWidth() * columnIndex;
		return laneX + this.laneWidth() / 2;
	}

	private drawNoteLimitLine(): void {
		this.renderer.makeLine(0, 0, this.renderer.width, 0);

		this.store.getKeyStates().forEach((status) => {
			this.userKeyInputsIndicators.get(status.key)!.visible =
				status.state === KeyState.PRESSED;
		});
	}

	private getDisplayedY(time: number): number {
		const spacingRatio = Number(
			getParameter('notes-spacing').orElseThrow(
				new Error('Could not read notes-spacing property')
			)
		);
		return (time - this.audioHandler.time()) / spacingRatio;
	}

	private draw(): void {
		Array.from(this.notes.entries()).forEach((entry) => {
			const [hit, rectangle] = entry;

			if (rectangle.position.y + rectangle.height < 0) {
				this.notes.delete(hit);
			}

			rectangle.position.y =
				this.getDisplayedY(hit.startTime) + rectangle.height / 2;
		});

		this.drawNoteLimitLine();
	}
}
