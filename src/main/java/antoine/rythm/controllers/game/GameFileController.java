package antoine.rythm.controllers.game;

import java.io.IOException;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.repositories.OsuBeatmapRepository;
import antoine.rythm.services.OsuArchiveService;
import antoine.rythm.services.UrlEncoderService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/game")
class GameFileController {
	private final OsuBeatmapRepository osuBeatmapRepository;
	private final OsuArchiveService osuArchiveService;
	private final UrlEncoderService urlEncoderService;

	@GetMapping(path = "/audio")
	public ResponseEntity<ByteArrayResource> audio(
			@RequestParam("archive-code") String archiveCode) throws IOException {

		OsuArchiveEntity archive = osuArchiveService.findByCode(archiveCode)
				.orElseThrow();
		return ResponseEntity.ok()
				.contentType(MediaType.asMediaType(MimeType.valueOf("audio/" + archive.getAudioFormat())))
				.body(new ByteArrayResource(archive.getAudio()));
	}

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap(
			@RequestParam("archive-code") String archiveCode,
			@RequestParam("encoded-difficulty") String encodedDifficulty) throws IOException {
		String decodedDifficulty = urlEncoderService.decode(encodedDifficulty);

		String beatmapContent = osuBeatmapRepository.findByArchiveCodeAndDifficulty(archiveCode, decodedDifficulty)
				.map(beatmap -> beatmap.getBeatmapContent())
				.orElseThrow();

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(beatmapContent);
	}

}
