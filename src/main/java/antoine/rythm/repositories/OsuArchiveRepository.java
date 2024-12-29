package antoine.rythm.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import antoine.rythm.entities.OsuArchiveEntity;


public interface OsuArchiveRepository extends JpaRepository<OsuArchiveEntity, String> {
	Optional<OsuArchiveEntity> findByCode(String code);
}
