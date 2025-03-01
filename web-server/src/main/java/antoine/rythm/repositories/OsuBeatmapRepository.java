package antoine.rythm.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import antoine.rythm.entities.OsuBeatmapEntity;

public interface OsuBeatmapRepository extends JpaRepository<OsuBeatmapEntity, String> {
	Optional<OsuBeatmapEntity> findByArchiveCodeAndDifficulty(String archiveCode, String difficulty);
}
