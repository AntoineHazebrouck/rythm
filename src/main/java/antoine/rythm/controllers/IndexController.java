package antoine.rythm.controllers;

import java.io.IOException;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import antoine.rythm.entities.UserEntity;
import antoine.rythm.services.OsuArchiveService;
import antoine.rythm.services.UrlEncoderService;
import antoine.rythm.services.UserService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
class IndexController {
	private final UserService userService;
	private final OsuArchiveService osuArchiveService;
	private final UrlEncoderService urlEncoderService;

	@GetMapping
	public String index(Model model, @AuthenticationPrincipal OAuth2User principal) {

		model.addAttribute(
				"archives",
				osuArchiveService.findAll());

		model.addAttribute("likedSongs",
				userService.asUserEntity(principal).getLikedSongs());

		return "index";
	}

	@PostMapping
	public RedirectView postMethodName(
			@RequestParam("archive-code") String archiveCode,
			@RequestParam("difficulty") String difficulty,
			@AuthenticationPrincipal OAuth2User principal) {

		String redirect = UriComponentsBuilder.newInstance()
				.path("/game")
				.queryParam("archive-code", archiveCode)
				.queryParam("encoded-difficulty", urlEncoderService.encode(difficulty))
				.queryParam("notes-spacing", userService.asUserEntity(principal).getNotesSpacing())
				.toUriString();

		return new RedirectView(redirect);
	}

	@PostMapping("/like")
	public RedirectView postMethodName(
			@RequestParam("archive-code") String archiveCode,
			@AuthenticationPrincipal OAuth2User principal) {

		UserEntity user = userService.asUserEntity(principal);

		user.getLikedSongs().add(osuArchiveService.findById(archiveCode).orElseThrow());

		userService.save(user);

		return new RedirectView("/#" + archiveCode);
	}

	@PostMapping(path = "/load-osu-archive")
	public RedirectView postMethodName(
			@RequestParam("osu-archive") MultipartFile osuArchive) throws IOException {

		if (osuArchive.isEmpty()) {
			return new RedirectView(UriComponentsBuilder.newInstance()
					.path("/")
					.queryParam("error", "uploaded-file-is-empty")
					.toUriString());
		} else {
			osuArchiveService.save(osuArchive);

			return new RedirectView(UriComponentsBuilder.newInstance()
					.path("/")
					.queryParam("success", "file-upload-successful")
					.toUriString());
		}
	}

}
