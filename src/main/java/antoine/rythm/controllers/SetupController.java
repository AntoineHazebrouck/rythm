package antoine.rythm.controllers;

import java.util.Base64;
import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import antoine.rythm.CurrentOsuArchiveService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/setup")
class SetupController {
	private final CurrentOsuArchiveService currentOsuArchiveService;

	@GetMapping
	public String setup(Model model) {
		model.addAttribute("beatmapsNames", currentOsuArchiveService.extractBeatmapsNames());
		return "setup";
	}

	@PostMapping
	public RedirectView postMethodName(
			@RequestParam("beatmap-name") Optional<String> beatmapName,
			@RequestParam("note-spacing") Optional<Integer> noteSpacing) {

		if (beatmapName.isEmpty() || noteSpacing.isEmpty()) {
			return new RedirectView("/setup?error=form-elements-missing");
		} else {
			String asBase64 = Base64.getEncoder().encodeToString(beatmapName.get().getBytes());

			String beatmapUrl = "/beatmap?encoded-beatmap-name=" + asBase64;

			String redirect = UriComponentsBuilder.newInstance()
					.path("/game")
					.queryParam("beatmap-url", beatmapUrl)
					.queryParam("note-spacing", Integer.toString(noteSpacing.get()))
					.toUriString();

			return new RedirectView(redirect);
		}
	}
}
