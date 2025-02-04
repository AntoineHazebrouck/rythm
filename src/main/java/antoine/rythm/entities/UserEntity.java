package antoine.rythm.entities;

import java.util.Map;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Data
@Entity
public class UserEntity {
	@Id
	private String login;

	private double notesSpacing;

	@ElementCollection
	private Map<Integer, Character> keys;

	@ManyToMany(cascade = CascadeType.ALL)
	private Set<OsuArchiveEntity> likedSongs;

	private AuthenticationProvider authenticationProvider;

	private String pictureUrl;
}
