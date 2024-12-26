package antoine.rythm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import antoine.rythm.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, String> {
	
}
