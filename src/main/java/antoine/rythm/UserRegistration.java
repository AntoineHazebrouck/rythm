package antoine.rythm;

import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;

import antoine.rythm.entities.UserEntity;
import antoine.rythm.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Configuration
class UserRegistration {
	private final UserService userService;

	@Bean
	ApplicationListener<AuthenticationSuccessEvent> registerAuthenticatedUser() {
		return (AuthenticationSuccessEvent event) -> {
			log.info("user authentication : {}", event);

			var principal = (OAuth2AuthenticatedPrincipal) event.getAuthentication().getPrincipal();

			if (!userService.existsById(principal.getAttribute("email"))) {
				UserEntity user = new UserEntity();
				user.setEmail(principal.getAttribute("email"));
				user.setNotesSpacing(1);
				userService.save(user);
			}
		};
	}
}
