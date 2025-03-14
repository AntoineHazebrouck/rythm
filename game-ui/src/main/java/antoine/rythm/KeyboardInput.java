package antoine.rythm;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
public class KeyboardInput {
	private final char key;
	private final Integer column;
	@EqualsAndHashCode.Exclude
	private KeyState state = KeyState.UP;
}
