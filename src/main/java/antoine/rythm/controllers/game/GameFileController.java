package antoine.rythm.controllers.game;

import java.io.IOException;
import java.util.Objects;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.services.OsuArchiveService;
import antoine.rythm.services.UrlEncoderService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/game")
class GameFileController {
	private final OsuArchiveService osuArchiveService;
	private final UrlEncoderService urlEncoderService;

	@GetMapping(path = "/audio")
	public ResponseEntity<ByteArrayResource> audio(
			@RequestParam("encoded-archive-name") String encodedArchiveName) throws IOException {
		String decodedArchiveName = urlEncoderService.decode(encodedArchiveName);

		OsuArchiveEntity archive = osuArchiveService.findById(decodedArchiveName)
				.orElseThrow();
		return ResponseEntity.ok()
				.contentType(MediaType.asMediaType(MimeType.valueOf("audio/" + archive.getAudioFormat())))
				.body(new ByteArrayResource(archive.getAudio()));
	}

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap(
			@RequestParam("encoded-archive-name") String encodedArchiveName,
			@RequestParam("encoded-beatmap-name") String encodedBeatmapName) throws IOException {
		String decodedArchiveName = urlEncoderService.decode(encodedArchiveName);
		String decodedBeatmapName = urlEncoderService.decode(encodedBeatmapName);

		OsuArchiveEntity archive = osuArchiveService.findById(decodedArchiveName)
				.orElseThrow();

		String beatmapContent = archive.getBeatmaps().stream()
				.filter(beatmap -> Objects.equals(beatmap.getBeatmapFileName(), decodedBeatmapName))
				.findFirst()
				.map(beatmap -> beatmap.getBeatmapContent())
				.orElseThrow();

		// osuArchiveService.extractBeatmapContent(
		// decodedArchiveName,
		// urlEncoderService.decode(encodedBeatmapName))
		// .orElseThrow();

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(beatmapContent);
	}

}
