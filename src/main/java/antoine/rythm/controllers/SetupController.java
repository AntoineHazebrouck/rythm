package antoine.rythm.controllers;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.services.OsuArchiveService;
import antoine.rythm.services.UrlEncoderService;
import antoine.rythm.services.UserService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/setup")
class SetupController {
	private final OsuArchiveService osuArchiveService;
	private final UrlEncoderService urlEncoderService;
	private final UserService userService;

	@GetMapping
	public String setup(
			@RequestParam("archive-code") String archiveCode,
			Model model) throws IOException {
		OsuArchiveEntity archive = osuArchiveService.findByCode(archiveCode).orElseThrow();

		model.addAttribute("archive", archive);

		return "setup";
	}

	@PostMapping
	public RedirectView postMethodName(
			@RequestParam("encoded-archive-name") String encodedArchiveName,
			@RequestParam("beatmap-name") Optional<String> beatmapName,
			@AuthenticationPrincipal OAuth2User principal) {

		if (beatmapName.isEmpty()) {
			return new RedirectView("/setup?error=form-elements-missing");
		} else {
			String redirect = UriComponentsBuilder.newInstance()
					.path("/game")
					.queryParam("encoded-archive-name", encodedArchiveName)
					.queryParam("encoded-beatmap-name", urlEncoderService.encode(beatmapName.get()))
					.queryParam("notes-spacing",
							Integer.toString(userService.asUserEntity(principal).getNotesSpacing()))
					.toUriString();

			return new RedirectView(redirect);
		}
	}
}
