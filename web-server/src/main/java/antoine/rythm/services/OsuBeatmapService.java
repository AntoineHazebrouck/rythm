package antoine.rythm.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipFile;

import org.springframework.stereotype.Service;

import antoine.rythm.entities.OsuBeatmapEntity;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
class OsuBeatmapService {
	private final OsuBeatmapMetatadaService metadataService;

	List<OsuBeatmapEntity> extractBeatmaps(String fileName, byte[] archive) throws IOException {
		ZipFile zip = ZipHelper.asZipFile(fileName, archive);

		return zip.stream()
				.map(entry -> entry.getName())
				.filter(name -> name.endsWith(".osu"))
				.distinct()
				.sorted()
				.map(name -> {
					final String content = content(zip, name);

					OsuBeatmapEntity beatmap = new OsuBeatmapEntity();
					beatmap.setId(metadataService.getMetadataValue(content, "BeatmapID").orElseThrow());

					beatmap.setBeatmapFileName(name);
					beatmap.setBeatmapContent(content);

					beatmap.setArtist(metadataService.getMetadataValue(content, "Artist").orElseThrow());
					beatmap.setSong(metadataService.getMetadataValue(content, "Title").orElseThrow());

					beatmap.setDifficulty(metadataService.getMetadataValue(content, "Version").orElseThrow());
					beatmap.setCreator(metadataService.getMetadataValue(content, "Creator").orElseThrow());

					return beatmap;
				})
				.toList();
	}

	private static String content(ZipFile zip, String beatmapName) {
		try (InputStream stream = zip.getInputStream(zip.getEntry(beatmapName))) {
			return new String(stream.readAllBytes());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
