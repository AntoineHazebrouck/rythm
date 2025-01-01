package antoine.rythm.controllers.dto;

import java.util.Map;

import antoine.rythm.entities.UserEntity;
import lombok.Data;

@Data
public class UserSettingsDto {
	private int notesSpacing;
	private Map<Integer, Character> keys;

	public static UserSettingsDto fromEntity(UserEntity entity) {
		UserSettingsDto dto = new UserSettingsDto();
		dto.setNotesSpacing(entity.getNotesSpacing());
		dto.setKeys(entity.getKeys());
		return dto;
	}

	public UserEntity toEntity(UserEntity entity) {
		entity.setEmail(entity.getEmail());
		entity.setLikedSongs(entity.getLikedSongs());

		entity.setNotesSpacing(this.getNotesSpacing());
		entity.setKeys(this.getKeys());
		return entity;
	}
}