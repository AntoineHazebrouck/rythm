import Two from 'two.js';
import { Group } from 'two.js/src/group';
import { RoundedRectangle } from 'two.js/src/shapes/rounded-rectangle';
import { AudioHandler } from '../audio-handler.js';
import { HitsHandler } from '../hits-handler.js';
import { KeyState } from '../inputs/key-state.js';
import { getParameter } from '../inputs/parameters-handler.js';
import { Store } from '../store.js';
import { HoldableObject } from 'osu-parsers';

export class CanvasDisplayHandler {
	private readonly store: Store;
	private readonly hitsHandler: HitsHandler;
	private readonly audioHandler: AudioHandler;
	private readonly renderer: Two;

	private readonly userKeyInputsIndicators: Map<string, RoundedRectangle>;
	private readonly notes: Group;

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
		}).appendTo(canvas); // TODO use

		this.notes = this.renderer.makeGroup(
			this.hitsHandler.nextHits().map((hit) => {
				if (hit instanceof HoldableObject) {
					const rectangle = this.renderer.makeRoundedRectangle(
						this.laneX(
							this.hitsHandler
								.columns()
								.findIndex((x) => x === hit.startX)
						),
						this.getDisplayedY(hit.startTime),
						this.laneWidth(),
						this.getDisplayedY(hit.endTime) -
							this.getDisplayedY(hit.startTime),
						5
					);

					return rectangle;
				} else {
					const start = this.getDisplayedY(hit.startTime - 5);
					const end = this.getDisplayedY(hit.startTime + 5);
					const rectangle = this.renderer.makeRoundedRectangle(
						this.laneX(
							this.hitsHandler
								.columns()
								.findIndex((x) => x === hit.startX)
						),
						start,
						this.laneWidth(),
						end - start,
						5
					);

					return rectangle;
				}
			})
		);

		this.userKeyInputsIndicators = new Map(
			this.store.getKeyStates().map((status) => {
				const rectangle = this.renderer.makeRoundedRectangle(
					this.laneX(this.store.getColumnForKey(status.key)),
					0,
					this.laneWidth(),
					10,
					5
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
		this.notes.position.y = this.getDisplayedY(
			this.hitsHandler.firstHit().startTime
		);

		this.drawNoteLimitLine();
	}
}
