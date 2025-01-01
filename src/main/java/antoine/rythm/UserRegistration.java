package antoine.rythm;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.oauth2.core.user.OAuth2User;

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

			var principal = (OAuth2User) event.getAuthentication().getPrincipal();

			if (!userService.exists(principal)) {
				UserEntity user = new UserEntity();
				user.setEmail(principal.getAttribute("email"));
				user.setNotesSpacing(2);

				Map<Integer, Character> keys = new HashMap<>();
				keys.put(1, 'a');
				keys.put(2, 'z');
				keys.put(3, 'e');
				keys.put(4, 'r');
				keys.put(5, 't');
				keys.put(6, 'y');
				keys.put(7, 'u');
				keys.put(8, 'i');
				keys.put(9, 'o');
				keys.put(10, 'p');
				keys.put(11, 'q');
				keys.put(12, 's');
				keys.put(13, 'd');
				keys.put(14, 'f');
				keys.put(15, 'g');
				user.setKeys(keys);

				userService.save(user);
			}
		};
	}
}
