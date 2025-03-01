package antoine.rythm;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
class SecurityConfiguration {

	@Bean
	SecurityFilterChain configure(HttpSecurity http) throws Exception {
		addH2Security(http).oauth2Login(Customizer.withDefaults());
		return http.build();
	}

	private HttpSecurity addH2Security(HttpSecurity http) throws Exception {
		return http
				.authorizeHttpRequests(requests -> requests
						.requestMatchers("/h2-console/**").permitAll()
						.anyRequest().authenticated())
				.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
				.csrf(csrf -> csrf.disable());
	}
}