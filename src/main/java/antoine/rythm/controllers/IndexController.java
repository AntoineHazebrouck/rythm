package antoine.rythm.controllers;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import antoine.rythm.services.OsuArchiveService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
class IndexController {
	private final OsuArchiveService osuArchiveService;

	@GetMapping
	public String index(Model model) {

		model.addAttribute(
				"archives",
				osuArchiveService.findAll());

		return "index";
	}

	@PostMapping
	public RedirectView postMethodName(@RequestParam("archive-code") String archiveCode) {

		String redirect = UriComponentsBuilder.newInstance()
				.path("/setup")
				.queryParam("archive-code", archiveCode)
				.toUriString();

		return new RedirectView(redirect);
	}

	@PostMapping(path = "/load-osu-archive")
	public RedirectView postMethodName(
			@RequestParam("osu-archive") MultipartFile osuArchive) throws IOException {

		osuArchiveService.save(osuArchive);

		return new RedirectView("/");
	}

}
