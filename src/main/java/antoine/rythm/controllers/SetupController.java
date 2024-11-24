package antoine.rythm.controllers;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import antoine.rythm.services.OsuArchiveService;
import antoine.rythm.services.UrlEncoderService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/setup")
class SetupController {
	private final OsuArchiveService currentOsuArchiveService;
	private final UrlEncoderService urlEncoderService;

	@GetMapping
	public String setup(
			@RequestParam("encoded-archive-name") String encodedArchiveName, // TODO handle error
			Model model) throws IOException {
		String decodedArchiveName = urlEncoderService.decode(encodedArchiveName);

		model.addAttribute("encodedArchiveName", encodedArchiveName);
		model.addAttribute("beatmapsNames", currentOsuArchiveService.extractBeatmapsNames(decodedArchiveName)
				.orElseThrow(
						() -> new IllegalArgumentException("file : %s was not found".formatted(decodedArchiveName))));
		return "setup";
	}

	@PostMapping
	public RedirectView postMethodName(
			@RequestParam("encoded-archive-name") String encodedArchiveName,
			@RequestParam("beatmap-name") Optional<String> beatmapName,
			@RequestParam("note-spacing") Optional<Integer> noteSpacing) {

		if (beatmapName.isEmpty() || noteSpacing.isEmpty()) {
			return new RedirectView("/setup?error=form-elements-missing");
		} else {
			String redirect = UriComponentsBuilder.newInstance()
					.path("/game")
					.queryParam("encoded-archive-name", encodedArchiveName)
					.queryParam("encoded-beatmap-name", urlEncoderService.encode(beatmapName.get()))
					.queryParam("note-spacing", Integer.toString(noteSpacing.get()))
					.toUriString();

			return new RedirectView(redirect);
		}
	}
}
