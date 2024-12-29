package antoine.rythm.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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

	@Column(unique = true)
	private String code;
	private String artist;
	private String song;

	@Lob
	private byte[] audio;
	private String audioFormat;

	@OneToMany(cascade = CascadeType.ALL)
	private List<OsuBeatmapEntity> beatmaps;
}
