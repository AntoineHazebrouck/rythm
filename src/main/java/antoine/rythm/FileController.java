package antoine.rythm;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Set;
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

	// @GetMapping(path = "/beatmaps/names")
	// public ResponseEntity<Set<String>> beatmapsNames() throws IOException {
	// 	return ResponseEntity.ok()
	// 			.contentType(MediaType.APPLICATION_JSON)
	// 			.body(currentOsuArchiveService.extractBeatmapsNames());
	// }

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap(
			@RequestParam("name") String name) throws IOException {

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(currentOsuArchiveService.extractBeatmapContent(name));
	}

}
