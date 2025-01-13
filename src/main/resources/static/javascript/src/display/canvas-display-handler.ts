import Two from 'two.js';
import { AudioHandler } from '../audio-handler.js';
import { HitsHandler } from '../hits-handler.js';
import { KeyState } from '../inputs/key-state.js';
import { getParameter } from '../inputs/parameters-handler.js';
import { Store } from '../store.js';

export class CanvasDisplayHandler {
	private readonly store: Store;
	private readonly hitsHandler: HitsHandler;
	private readonly audioHandler: AudioHandler;
	private readonly renderer: Two;

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

		this.store.getKeyStates().forEach((status) => {
			if (status.state === KeyState.PRESSED) {
				console.log(status);

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

		this.drawNoteLimitLine();
		// this.renderer .beginPath();
		// this.renderer.moveTo(0, 0);
		// this.renderer.lineTo(this.renderer.width, 0);
		// this.renderer.stroke();

		// this.context.clearRect(0, 0, this.renderer.width, this.renderer.height);

		// this.hitsHandler.nextHits().forEach((hit) => {
		// 	this.context.beginPath();
		// 	const laneX =
		// 		this.laneWidth() *
		// 		this.hitsHandler.columns().findIndex((x) => x === hit.startX);
		// 	this.context.moveTo(laneX, this.getDisplayedY(hit.startTime));

		// 	if (hit instanceof HoldableObject) {
		// 		this.context.rect(
		// 			laneX,
		// 			this.getDisplayedY(hit.startTime),
		// 			this.laneWidth(),
		// 			this.getDisplayedY(hit.endTime) -
		// 				this.getDisplayedY(hit.startTime)
		// 		);
		// 	} else {
		// 		const start = this.getDisplayedY(hit.startTime - 5);
		// 		const end = this.getDisplayedY(hit.startTime + 5);
		// 		this.context.rect(laneX, start, this.laneWidth(), end - start);
		// 	}
		// 	this.context.fill();
		// });
		// this.drawNoteLimitLine();
		// this.renderer.update();
	}
}
