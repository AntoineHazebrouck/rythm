package antoine.rythm.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice(annotations = { Controller.class, RestController.class })
class ControllerAdvisor {

	@ModelAttribute("principal")
	public OAuth2User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {

		return principal;
	}
}
