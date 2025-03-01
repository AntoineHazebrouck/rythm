package antoine.rythm.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
class OsuBeatmapMetatadaService {

	Optional<String> getMetadataValue(String beatmapContent, String metadataKey) {
		return beatmapContent.lines()
				.filter(line -> line.startsWith(metadataKey + ":"))
				.findFirst()
				.map(line -> line.split(":")[1]);
	}
}
