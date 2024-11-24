package antoine.rythm.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

@Data
@Entity
public class OsuArchiveEntity {
	@Id
	String name;

	@Lob
	byte[] archive;
}
