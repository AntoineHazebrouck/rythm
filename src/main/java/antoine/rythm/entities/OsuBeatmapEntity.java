package antoine.rythm.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class OsuBeatmapEntity {
	// TODO create unique id
	@Id
	private String beatmapFileName;

	private String difficulty;
	private String creator;

	private String artist;
	private String song;

	@Lob
	private String beatmapContent;

	@ManyToOne(cascade = CascadeType.ALL)
	private OsuArchiveEntity archive;
}
