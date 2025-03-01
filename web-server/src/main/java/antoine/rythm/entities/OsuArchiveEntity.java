package antoine.rythm.entities;

import java.util.List;

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
	private String code;
	private String artist;
	private String song;

	@Lob
	private byte[] audio;
	private String audioFormat;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "archive")
	private List<OsuBeatmapEntity> beatmaps;

	public void setBeatmaps(List<OsuBeatmapEntity> beatmaps) {
		this.beatmaps = beatmaps.stream()
				.map(beatmap -> {
					beatmap.setArchive(this);
					return beatmap;
				})
				.toList();
	}
}
