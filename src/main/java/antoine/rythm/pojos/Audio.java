package antoine.rythm.pojos;

import lombok.Data;

@Data
public class Audio {
	private final byte[] data;
	private final String format;
}
