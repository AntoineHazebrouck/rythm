const errorTag = document.querySelector("#error-message")!;

export function displayError(error: Error): void {
	errorTag.innerHTML = error.message;
}