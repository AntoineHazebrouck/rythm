package antoine.rythm.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/game")
class GameController {
	@GetMapping
	public String game() {
		return "game";
	}
}
