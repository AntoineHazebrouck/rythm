import { CanvasDisplayHandler } from './display/canvas-display-handler';
import { TimedEventsHandler } from './timed-events-handler';

export class Gameloop {
	private readonly canvasDisplayHandler: CanvasDisplayHandler;
	private readonly timedEventsHandler: TimedEventsHandler;

	public constructor(
		canvasDisplayHandler: CanvasDisplayHandler,
		timedEventsHandler: TimedEventsHandler
	) {
		this.canvasDisplayHandler = canvasDisplayHandler;
		this.timedEventsHandler = timedEventsHandler;
	}

	public loop(): void {
		this.canvasDisplayHandler.draw();
		this.timedEventsHandler.transferUnhitNotesAsMisses();

		window.requestAnimationFrame(() => this.loop());
	}
}
