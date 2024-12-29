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
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/archive-selection")
class ArchiveSelection {
	private final OsuArchiveService osuArchiveService;

	@GetMapping
	public String getMethodName(Model model) {
		model.addAttribute(
				"archivesNames",
				osuArchiveService.findAll().stream()
						.map(archive -> archive.getArchiveFileName())
						.toList());
		return "archive-selection";
	}

	@PostMapping
	public RedirectView postMethodName(@RequestParam("archive-code") String archiveCode) {

		String redirect = UriComponentsBuilder.newInstance()
				.path("/setup")
				.queryParam("archive-code", archiveCode)
				.toUriString();

		return new RedirectView(redirect);
	}

}
