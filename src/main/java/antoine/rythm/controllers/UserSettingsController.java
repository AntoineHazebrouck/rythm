package antoine.rythm.controllers;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import antoine.rythm.controllers.dto.UserSettingsDto;
import antoine.rythm.entities.UserEntity;
import antoine.rythm.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user/settings")
class UserSettingsController {
	private final UserService userService;

	@GetMapping
	public String getMethodName(@AuthenticationPrincipal OAuth2User principal, Model model) {
		UserEntity user = userService.asUserEntity(principal);

		model.addAttribute("userSettings", UserSettingsDto.fromEntity(user));

		return "settings";
	}

	@PostMapping
	public RedirectView postMethodName(
			@Valid @ModelAttribute("userSettings") UserSettingsDto userSettings,
			@AuthenticationPrincipal OAuth2User principal) {
		UserEntity user = userService.asUserEntity(principal);

		userService.save(userSettings.toEntity(user));

		return new RedirectView("/user/settings");
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public RedirectView handleConstraintViolationException(RedirectAttributes attributes, MethodArgumentNotValidException cve) {
		List<String> errorMessages = cve.getFieldErrors()
				.stream()
				.map(error -> error.getField() + " : " + error.getDefaultMessage())
				.toList();

		
		attributes.addAttribute("error", errorMessages);

		return new RedirectView("/user/settings");
	}
}
