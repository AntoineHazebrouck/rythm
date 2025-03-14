package antoine.rythm;

import org.teavm.jso.dom.events.KeyboardEvent;
import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLInputElement;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class EventListeners {
	private final HTMLDocument document;
	private final Store store;
	private final HTMLInputElement volumeSlider;

	public void init() {
		document.addEventListener("keydown", (KeyboardEvent event) -> {
			event.preventDefault();

			if (store.getKeyState(event.getKey().charAt(0)) == KeyState.UP) {
				store.setKeyState(event.getKey().charAt(0), KeyState.PRESSED);
			}
		});

		document.addEventListener("keyup", (KeyboardEvent event) -> {
			event.preventDefault();

			store.setKeyState(event.getKey().charAt(0), KeyState.UP);

		});

		volumeSlider.addEventListener("input", (event) -> {
			event.preventDefault();

			store.setVolume(Double.parseDouble(volumeSlider.getValue()));
		});
	}
}
