package antoine.rythm.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.pojos.Audio;
import antoine.rythm.repositories.OsuArchiveRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OsuArchiveService {
	private final OsuArchiveRepository repository;
	private final OsuBeatmapService osuBeatmapService;

	public OsuArchiveEntity save(MultipartFile osuArchive) throws IOException {

		String fileName = osuArchive.getOriginalFilename();

		OsuArchiveEntity archive = new OsuArchiveEntity();

		archive.setCode(fileName.substring(0, 6));

		String withoutCode = fileName.substring(7, fileName.length() - 4);
		archive.setArtist(withoutCode.split(" - ")[0]);
		archive.setSong(withoutCode.split(" - ")[1]);

		Audio audio = extractAudio(fileName, osuArchive.getBytes());
		archive.setAudio(audio.getData());
		archive.setAudioFormat(audio.getFormat());

		archive.setBeatmaps(osuBeatmapService.extractBeatmaps(fileName, osuArchive.getBytes()));

		return save(archive);
	}

	public OsuArchiveEntity save(OsuArchiveEntity entity) {
		repository.delete(entity);
		return repository.save(entity);
	}

	public List<OsuArchiveEntity> findAll() {
		return repository.findAll();
	}

	public Optional<OsuArchiveEntity> findById(String archiveFileName) {
		return repository.findById(archiveFileName);
	}

	private static ZipEntry getLargestAudioEntry(ZipFile zip) {
		return zip.stream()
				.filter(entry -> Stream.of(".ogg", ".wav", "mp3").anyMatch(format -> entry.getName().endsWith(format)))
				.sorted((left, right) -> Long.compare(right.getSize(), left.getSize()))
				.findFirst()
				.orElseThrow();
	}

	private static Audio extractAudio(String fileName, byte[] archive) throws IOException {
		ZipFile zip = ZipHelper.asZipFile(fileName, archive);

		ZipEntry audio = getLargestAudioEntry(zip);
		InputStream stream = zip.getInputStream(audio);
		String[] split = audio.getName().split("\\.");
		String format = split[split.length - 1];

		return new Audio(stream.readAllBytes(), format);
	}

}
