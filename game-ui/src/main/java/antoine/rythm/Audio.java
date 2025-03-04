package antoine.rythm;

import org.teavm.jso.JSClass;
import org.teavm.jso.JSMethod;
import org.teavm.jso.JSObject;

@JSClass
public class Audio implements JSObject {
	public Audio(String source) {

	}

	@JSMethod
	public native void play();
}
