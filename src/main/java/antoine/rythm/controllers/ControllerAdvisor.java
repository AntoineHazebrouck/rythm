package antoine.rythm.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice(annotations = { Controller.class, RestController.class })
class ControllerAdvisor {

	@ModelAttribute("principal")
	public OAuth2User getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {

		return principal;
	}

	// https://stackoverflow.com/questions/73638868/springboot-controller-send-400-on-validation-error
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<List<String>> handleConstraintViolationException(MethodArgumentNotValidException cve) {
		List<String> errorMessages = cve.getFieldErrors()
				.stream()
				.map(error -> error.getField() + " : " + error.getDefaultMessage())
				.toList();

		return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
	}
}
