package antoine.rythm;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;


@Controller
public class HtmlController {

	@GetMapping("/index")
	public String index() {
		return "index";
	}

	@GetMapping("/setup")
	public String setup() {
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
