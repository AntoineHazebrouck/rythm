package antoine.rythm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import antoine.rythm.entities.OsuBeatmapEntity;

public interface OsuBeatmapRepository extends JpaRepository<OsuBeatmapEntity, String> {
	
}
