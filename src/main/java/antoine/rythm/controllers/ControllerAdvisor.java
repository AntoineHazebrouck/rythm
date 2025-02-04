package antoine.rythm.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import antoine.rythm.entities.UserEntity;
import antoine.rythm.services.UserService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@ControllerAdvice(annotations = { Controller.class, RestController.class })
class ControllerAdvisor {
	private final UserService userService;

	@ModelAttribute("principal")
	public UserEntity getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {

		return userService.asUserEntity(principal);
	}
}
