const errorTag = document.querySelector("#error-message")!;

errorTag.innerHTML = 'Error';

export function displayError(error: Error): void {
	errorTag.innerHTML = error.message;
}