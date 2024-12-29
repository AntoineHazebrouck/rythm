package antoine.rythm.entities;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Data
@Entity
public class UserEntity {
	@Id
	private String email;

	private int notesSpacing;

	@ManyToMany(cascade = CascadeType.ALL)
	private Set<OsuArchiveEntity> likedSongs;
}
