package antoine.rythm.services;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import antoine.rythm.entities.UserEntity;
import antoine.rythm.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepository;

	public UserEntity asUserEntity(OAuth2User principal) {
		return userRepository.findById(principal.getAttribute("email")).orElseThrow();
	}

	public UserEntity save(UserEntity user) {
		return userRepository.save(user);
	}

	public boolean exists(OAuth2User principal) {
		return userRepository.existsById(principal.getAttribute("email"));
	}
}
