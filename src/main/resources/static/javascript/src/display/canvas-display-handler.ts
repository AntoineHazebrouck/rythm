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
	private static readonly DEFAULT_RECTANGLE_HEIGHT = 1;

	private readonly store: Store;
	private readonly hitsHandler: HitsHandler;
	private readonly audioHandler: AudioHandler;
	private readonly renderer: Two;

	private readonly userKeyInputsIndicators: Map<string, RoundedRectangle>;
	private readonly notes: Map<HitObject, RoundedRectangle>;
	// private readonly notes: Group;

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

		const rectangleRadius = 5;

		this.notes = new Map();
		//  = this.renderer.makeGroup(
		this.hitsHandler.nextHits().forEach((hit) => {
			console.log(
				'hit.startTime',
				hit.startTime,
				'this.getDisplayedY(hit.startTime)',
				this.getDisplayedY(hit.startTime)
			);

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
				0, // TODO make rectangle in factory
				this.laneWidth(),
				rectangleHeight, // TODO
				rectangleRadius
			);

			this.notes.set(hit, rectangle);
		});

		this.userKeyInputsIndicators = new Map(
			this.store.getKeyStates().map((status) => {
				const rectangle = this.renderer.makeRoundedRectangle(
					this.laneX(this.store.getColumnForKey(status.key)),
					0,
					this.laneWidth(),
					CanvasDisplayHandler.DEFAULT_RECTANGLE_HEIGHT,
					rectangleRadius
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

	private getDisplayedY(actualY: number): number {
		const spacingRatio = Number(
			getParameter('notes-spacing').orElseThrow(
				new Error('Could not read notes-spacing property')
			)
		);
		return (actualY - this.audioHandler.time()) / spacingRatio;
	}

	public draw(): void {
		Array.from(this.notes.entries()).forEach((entry) => {
			const [hit, rectangle] = entry;

			rectangle.position.y = this.getDisplayedY(
				hit.startTime
			) + rectangle.height / 2;
		});

		this.drawNoteLimitLine();
	}
}
