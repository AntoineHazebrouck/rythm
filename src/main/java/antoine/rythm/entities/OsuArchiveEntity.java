package antoine.rythm.entities;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class OsuArchiveEntity {
	@Id
	private String archiveFileName;

	private String code;
	private String artist;
	private String song;

	@Lob
	private byte[] audio;
	private String audioFormat;

	@OneToMany(cascade = CascadeType.ALL)
	private Set<OsuBeatmapEntity> beatmaps;

	@Deprecated
	@Lob
	private byte[] archive;
}
