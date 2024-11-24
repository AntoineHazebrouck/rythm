package antoine.rythm.controllers;

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
@RequestMapping("/archive-selection")
class ArchiveSelection {
	private final OsuArchiveService osuArchiveService;
	private final UrlEncoderService urlEncoderService;

	@GetMapping
	public String getMethodName(Model model) {
		model.addAttribute(
				"archivesNames",
				osuArchiveService.findAll().stream()
						.map(archive -> archive.getName())
						.toList());
		return "archive-selection";
	}

	@PostMapping
	public RedirectView postMethodName(
			@RequestParam("archive-name") String archiveName) {

		String redirect = UriComponentsBuilder.newInstance()
				.path("/setup")
				.queryParam("encoded-archive-name", urlEncoderService.encode(archiveName))
				.toUriString();

		return new RedirectView(redirect);
	}

}
