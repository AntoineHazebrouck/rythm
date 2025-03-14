package antoine.rythm;

import java.util.NoSuchElementException;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import lombok.ToString;

@ToString
@RequiredArgsConstructor
public class Store {
	private final Set<KeyboardInput> inputs;
	private double volume;

	public void setKeyState(char key, KeyState pressed) {
		var selected = inputs.stream()
				.filter(input -> input.getKey() == key)
				.findFirst()
				.orElseThrow(() -> new NoSuchElementException("Key %s was not found".formatted(key)));
		selected.setState(pressed);

		log(); // TODO move to an observer
	}

	public KeyState getKeyState(char key) {
		return inputs.stream()
				.filter(input -> input.getKey() == key)
				.findFirst()
				.map(input -> input.getState())
				.orElseThrow(() -> new NoSuchElementException("Key %s was not found".formatted(key)));
	}

	public void setVolume(double volume) {
		this.volume = volume;
		log();
	}

	private void log() {
		System.out.println("Store modified, new version : ");
		System.out.println(this);
	}
}
