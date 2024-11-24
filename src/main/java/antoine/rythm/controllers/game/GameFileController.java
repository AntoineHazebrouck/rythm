package antoine.rythm.controllers.game;

import java.io.IOException;
import java.util.function.Supplier;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import antoine.rythm.Audio;
import antoine.rythm.services.OsuArchiveService;
import antoine.rythm.services.UrlEncoderService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/game")
class GameFileController {
	private final OsuArchiveService currentOsuArchiveService;
	private final UrlEncoderService urlEncoderService;

	private static Supplier<IllegalArgumentException> archiveNotFound(String file) {
		return () -> new IllegalArgumentException("archive : %s was not found".formatted(file));
	}

	@GetMapping(path = "/audio")
	public ResponseEntity<ByteArrayResource> audio(
			@RequestParam("encoded-archive-name") String encodedArchiveName) throws IOException {
		String decodedArchiveName = urlEncoderService.decode(encodedArchiveName);
		Audio audio = currentOsuArchiveService.extractAudio(decodedArchiveName)
				.orElseThrow(archiveNotFound(decodedArchiveName));
		return ResponseEntity.ok()
				.contentType(MediaType.asMediaType(MimeType.valueOf("audio/" + audio.getFormat())))
				.body(new ByteArrayResource(audio.getData()));
	}

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap(
			@RequestParam("encoded-archive-name") String encodedArchiveName,
			@RequestParam("encoded-beatmap-name") String encodedBeatmapName) throws IOException {
		String decodedArchiveName = urlEncoderService.decode(encodedArchiveName);

		String beatmapContent = currentOsuArchiveService.extractBeatmapContent(
				decodedArchiveName,
				urlEncoderService.decode(encodedBeatmapName))
				.orElseThrow(archiveNotFound(decodedArchiveName));

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(beatmapContent);
	}

}
