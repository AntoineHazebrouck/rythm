package antoine.rythm.controllers;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.services.OsuArchiveService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
class IndexController {
	private final OsuArchiveService currentOsuArchiveService;

	@GetMapping
	public String index() {
		return "index";
	}

	@PostMapping(path = "/load-osu-archive")
	public RedirectView postMethodName(
			@RequestParam("osu-archive") MultipartFile osuArchive) throws IOException {

		OsuArchiveEntity archive = new OsuArchiveEntity();
		archive.setName(osuArchive.getOriginalFilename());
		archive.setArchive(osuArchive.getBytes());
		currentOsuArchiveService.save(archive);

		return new RedirectView("/archive-selection");
	}

}
