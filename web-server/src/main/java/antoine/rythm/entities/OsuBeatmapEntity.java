package antoine.rythm.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class OsuBeatmapEntity {
	@Id
	private String id;

	private String beatmapFileName;

	private String difficulty;
	private String creator;

	private String artist;
	private String song;

	@Lob
	private String beatmapContent;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(nullable = false)
	private OsuArchiveEntity archive;
}
