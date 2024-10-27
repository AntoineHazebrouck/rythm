package antoine.rythm;

import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileController {
	private final ZipFile zip;

	public FileController(ResourceLoader resourceLoader) throws ZipException, IOException {
		this.zip = new ZipFile(
				resourceLoader.getResource("classpath:osu/2070917 Tan Bionica - Ciudad Magica.osz").getFile());
	}

	@GetMapping(path = "/audio")
	public ResponseEntity<InputStreamResource> audio() throws IOException {
		InputStream stream = zip.getInputStream(zip.getEntry("audio.ogg"));
		return ResponseEntity.ok()
				.contentType(MediaType.asMediaType(MimeType.valueOf("audio/ogg")))
				.body(new InputStreamResource(stream));
	}

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap() throws IOException {
		InputStream stream = zip.getInputStream(zip.getEntry("Tan Bionica - Ciudad Magica (Midnaait) [Facil].osu"));

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(new String(stream.readAllBytes()));
	}
}
