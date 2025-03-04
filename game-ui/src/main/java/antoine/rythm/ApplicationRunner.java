package antoine.rythm;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.teavm.jso.browser.Window;
import org.teavm.jso.dom.html.HTMLDocument;

import antoine.rythm.display.HtmlDisplayHandler;
import antoine.rythm.utils.url.URLParameters;

public class ApplicationRunner {
	private final HTMLDocument document = HTMLDocument.current();
	private final Window window = Window.current();
	private final URLParameters parameters = new URLParameters(window);

	private final Store store;

	private final HtmlDisplayHandler htmlDisplayHandler;

	public ApplicationRunner() {
		Map<Character, Integer> inputs = new HashMap<>();
		inputs.put(' ', -1);
		inputs.put(get("1", 'a'), 0);
		inputs.put(get("2", 'z'), 1);
		inputs.put(get("3", 'e'), 2);
		inputs.put(get("4", 'r'), 3);
		inputs.put(get("5", 't'), 4);
		inputs.put(get("6", 'y'), 5);
		inputs.put(get("7", 'u'), 6);
		inputs.put(get("8", 'i'), 7);
		inputs.put(get("9", 'o'), 8);
		inputs.put(get("10", 'p'), 9);
		inputs.put(get("11", 'q'), 10);
		inputs.put(get("12", 's'), 11);
		inputs.put(get("13", 'd'), 12);
		inputs.put(get("14", 'f'), 13);
		inputs.put(get("15", 'g'), 14);

		this.store = new Store(inputs);

		this.htmlDisplayHandler = new HtmlDisplayHandler(
				this.document.querySelector("#note-rating"),
				this.document.querySelector("#error-message"));
	}

	public void run() throws IOException {
		htmlDisplayHandler.displayRating("None");

		System.out.println(get("10", 'P'));

		// document.getBody().setInnerText("Hello totooooo");
		System.out.println("Hello world!");

		String archiveCode = parameters.get("archive-code")
				.orElseThrow(() -> new IllegalArgumentException("Could not read archive-code property"));
		String encodedDifficulty = parameters.get("encoded-difficulty")
				.orElseThrow(() -> new IllegalArgumentException("Could not read encoded-difficulty property"));

		document.addEventListener("click", event -> {
			event.preventDefault();

			Audio audio = new Audio("/game/audio?archive-code=%s".formatted(archiveCode));
			audio.play();
		});

		URL url = new URL("https://localhost/game/beatmap?archive-code=%s&encoded-difficulty=%s".formatted(
				archiveCode,
				encodedDifficulty));
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");

		String response = new String(con.getInputStream().readAllBytes());

		System.out.println(response);

	}

	private char get(String urlParam, char orElse) {
		return parameters.get(urlParam)
				.map(value -> value.charAt(0))
				.orElse(orElse);
	}
}
