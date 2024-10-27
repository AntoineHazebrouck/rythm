package antoine.rythm;

import org.springframework.beans.factory.annotation.Autowired;
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
	public String setup(@Autowired Model model) {
		model.addAttribute("beatmaps-names", currentOsuArchiveService.extractBeatmapsNames());
		return "setup";
	}

	@GetMapping("/game")
	public String game() {
		return "game";
	}

	@PostMapping("/setup-game")
	public RedirectView postMethodName(@RequestParam("note-spacing") int noteSpacing) {
		return new RedirectView("/game");
	}
	

}
