package antoine.rythm.entities;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class UserEntity {
	@Id
	private String email;

	private int notesSpacing;

	@OneToMany
	private Set<OsuArchiveEntity> likedSongs;
}
