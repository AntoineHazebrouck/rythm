package antoine.rythm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import antoine.rythm.entities.OsuArchiveEntity;

public interface OsuArchiveRepository extends JpaRepository<OsuArchiveEntity, String> {
}
