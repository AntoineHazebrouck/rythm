package antoine.rythm;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Base64;
import java.util.zip.ZipException;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class FileController {
	private final CurrentOsuArchiveService currentOsuArchiveService;

	@PostMapping(path = "/load-osu-archive")
	public RedirectView setupGame(
			@RequestParam("osu-archive") MultipartFile osuArchive)
			throws ZipException, IOException, IllegalStateException, URISyntaxException {

		currentOsuArchiveService.setCurrentArchive(osuArchive);

		return new RedirectView("/setup");
	}

	@GetMapping(path = "/audio")
	public ResponseEntity<ByteArrayResource> audio() throws IOException {
		Audio audio = currentOsuArchiveService.extractAudio();
		return ResponseEntity.ok()
				.contentType(MediaType.asMediaType(MimeType.valueOf("audio/" + audio.getFormat())))
				.body(new ByteArrayResource(audio.getData()));
	}

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap(
			@RequestParam("encoded-beatmap-name") String encodedName) throws IOException {

		byte[] decodedBytes = Base64.getDecoder().decode(encodedName);
		String decoded = new String(decodedBytes);

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(currentOsuArchiveService.extractBeatmapContent(decoded));
	}

}
