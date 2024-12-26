package antoine.rythm;

import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;

import antoine.rythm.entities.UserEntity;
import antoine.rythm.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Configuration
class UserRegistration {
	private final UserRepository userRepository;

	@Bean
	ApplicationListener<AuthenticationSuccessEvent> registerAuthenticatedUser() {
		return (AuthenticationSuccessEvent event) -> {
			log.info("user authentication : {}", event);

			var principal = (OAuth2AuthenticatedPrincipal) event.getAuthentication().getPrincipal();

			UserEntity user = new UserEntity();
			user.setEmail(principal.getAttribute("email"));
			userRepository.save(user);
		};
	}
}
