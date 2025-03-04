package antoine.rythm.utils.url;

import org.teavm.jso.JSClass;
import org.teavm.jso.JSMethod;
import org.teavm.jso.JSObject;

@JSClass
class URLSearchParams implements JSObject {
	public URLSearchParams(String url) {

	}

	@JSMethod
	public native String get(String key);
}
