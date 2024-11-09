export class ErrorHandler {
	private readonly errorTag: HTMLElement;

	public constructor(errorTag: HTMLElement) {
		this.errorTag = errorTag;
	}

	public displayError(error: Error): void {
		this.errorTag.innerHTML = error.message;
	}
}