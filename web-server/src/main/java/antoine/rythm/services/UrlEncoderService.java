package antoine.rythm.services;

import java.util.Base64;

import org.springframework.stereotype.Service;

@Service
public class UrlEncoderService {
	public String encode(String data) {
		return Base64.getEncoder().encodeToString(data.getBytes());
	}

	public String decode(String data) {
		return new String(Base64.getDecoder().decode(data.getBytes()));
	}
}
