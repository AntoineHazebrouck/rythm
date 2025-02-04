package antoine.rythm.controllers.dto;

import java.util.Map;

import antoine.rythm.entities.UserEntity;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserSettingsDto {
	@DecimalMin("0.5")
	@DecimalMax("15")
	private double notesSpacing;

	@Size(min = 15, max = 15)
	private Map<Integer, Character> keys;

	public static UserSettingsDto fromEntity(UserEntity entity) {
		UserSettingsDto dto = new UserSettingsDto();
		dto.setNotesSpacing(entity.getNotesSpacing());
		dto.setKeys(entity.getKeys());
		return dto;
	}

	public UserEntity toEntity(UserEntity entity) {
		entity.setLogin(entity.getLogin());
		entity.setLikedSongs(entity.getLikedSongs());

		entity.setNotesSpacing(this.getNotesSpacing());
		entity.setKeys(this.getKeys());
		return entity;
	}
}