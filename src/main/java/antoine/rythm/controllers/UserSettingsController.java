package antoine.rythm.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import antoine.rythm.entities.UserEntity;
import antoine.rythm.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user/settings")
class UserSettingsController {
	private final UserRepository userRepository;

	@GetMapping
	public String getMethodName(@AuthenticationPrincipal OAuth2User principal, Model model) {
		UserEntity user = asUserEntity(principal);

		model.addAttribute("notesSpacing", user.getNotesSpacing());

		return "settings";
	}

	@PostMapping
	public RedirectView postMethodName(
			@RequestParam("notes-spacing") int notesSpacing,
			@AuthenticationPrincipal OAuth2User principal) {
		UserEntity user = asUserEntity(principal);

		user.setNotesSpacing(notesSpacing);

		userRepository.save(user);

		return new RedirectView("/");
	}

	private UserEntity asUserEntity(OAuth2User principal) {
		return userRepository.findById(principal.getAttribute("email"))
				.orElseThrow(() -> new IllegalArgumentException("user was not found"));
	}
}
