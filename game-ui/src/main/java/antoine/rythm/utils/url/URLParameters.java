package antoine.rythm.utils.url;

import java.util.Optional;

import org.teavm.jso.browser.Window;

public class URLParameters {
	private final URLSearchParams urlParams;

	public URLParameters(Window window) {
		this.urlParams = new URLSearchParams(window.getLocation().getSearch());
	}

	public Optional<String> get(String key) {
		return Optional.ofNullable(urlParams.get(key));
	}
}
