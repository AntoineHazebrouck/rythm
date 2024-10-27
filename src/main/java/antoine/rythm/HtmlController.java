package antoine.rythm;

import java.util.Base64;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class HtmlController {
	private final CurrentOsuArchiveService currentOsuArchiveService;

	@GetMapping("/index")
	public String index() {
		return "index";
	}

	@GetMapping("/setup")
	public String setup(Model model) {
		model.addAttribute("beatmapsNames", currentOsuArchiveService.extractBeatmapsNames());
		return "setup";
	}

	@GetMapping("/game")
	public String game() {
		return "game";
	}

	@PostMapping("/setup-game")
	public RedirectView postMethodName(
			@RequestParam("beatmap-name") String beatmapName,
			@RequestParam("note-spacing") int noteSpacing) {
		String asBase64 = Base64.getEncoder().encodeToString(beatmapName.getBytes());

		String beatmapUrl = "/beatmap?encoded-beatmap-name=" + asBase64;
		return new RedirectView("/game?beatmap-url=" + beatmapUrl);
	}

}
