package antoine.rythm;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Set;

import org.teavm.jso.browser.Window;
import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLInputElement;

import antoine.rythm.display.HtmlDisplayHandler;
import antoine.rythm.utils.url.URLParameters;

public class ApplicationRunner {
	private final HTMLDocument document = HTMLDocument.current();
	private final Window window = Window.current();
	private final URLParameters parameters = new URLParameters(window);

	private final Store store;

	private final HtmlDisplayHandler htmlDisplayHandler;

	private final EventListeners eventListeners;

	public ApplicationRunner() {
		Set<KeyboardInput> inputs = Set.of(
				new KeyboardInput(' ', null),
				new KeyboardInput(get("1", 'a'), 0),
				new KeyboardInput(get("2", 'z'), 1),
				new KeyboardInput(get("3", 'e'), 2),
				new KeyboardInput(get("4", 'r'), 3),
				new KeyboardInput(get("5", 't'), 4),
				new KeyboardInput(get("6", 'y'), 5),
				new KeyboardInput(get("7", 'u'), 6),
				new KeyboardInput(get("8", 'i'), 7),
				new KeyboardInput(get("9", 'o'), 8),

				new KeyboardInput(get("10", 'p'), 9),
				new KeyboardInput(get("11", 'q'), 10),
				new KeyboardInput(get("12", 's'), 11),
				new KeyboardInput(get("13", 'd'), 12),
				new KeyboardInput(get("14", 'f'), 13),
				new KeyboardInput(get("15", 'g'), 14));

		this.store = new Store(inputs);

		this.htmlDisplayHandler = new HtmlDisplayHandler(
				this.document.querySelector("#note-rating"),
				this.document.querySelector("#error-message"));

		this.eventListeners = new EventListeners(document, store, (HTMLInputElement) document.querySelector("#volume"));
	}

	public void run() throws IOException {
		eventListeners.init();
		htmlDisplayHandler.displayRating("None");

		String archiveCode = parameters.get("archive-code")
				.orElseThrow(() -> new IllegalArgumentException("Could not read archive-code property"));
		String encodedDifficulty = parameters.get("encoded-difficulty")
				.orElseThrow(() -> new IllegalArgumentException("Could not read encoded-difficulty property"));

		Audio audio = new Audio("/game/audio?archive-code=%s".formatted(archiveCode));

		document.addEventListener("click", event -> {
			event.preventDefault();

			audio.play();
		});

		URL url = new URL("https://localhost/game/beatmap?archive-code=%s&encoded-difficulty=%s".formatted(
				archiveCode,
				encodedDifficulty));
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");

		String response = new String(con.getInputStream().readAllBytes());

	}

	private char get(String urlParam, char orElse) {
		return parameters.get(urlParam)
				.map(value -> value.charAt(0))
				.orElse(orElse);
	}
}
