package antoine.rythm.display;

import org.teavm.jso.dom.html.HTMLElement;

import static j2html.TagCreator.*; // Use static star import


public class HtmlDisplayHandler {
	private final HTMLElement noteRating;
	private final HTMLElement error;

	public HtmlDisplayHandler(HTMLElement noteRating, HTMLElement error) {
		this.noteRating = noteRating;
		this.error = error;
	}

	public void displayRating(String string) {
		noteRating.setInnerHTML("""
				<div
						class="alert alert-success mx-auto my-0 px-4 py-2"
						role="alert"
						style="width: fit-content"
					>
						<h3
							class="text-uppercase m-0"
							style="width: fit-content"
						>%s</h3>
				</div>
						"""
				.formatted(string));
	}

	public void displayError(Exception error) {
		this.error.setInnerHTML("""
				<div class="alert alert-danger mx-auto" role="alert">%s</div>
					"""
				.formatted(error.getMessage()));
	}
}
