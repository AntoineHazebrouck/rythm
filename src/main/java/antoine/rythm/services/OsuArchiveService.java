package antoine.rythm.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.entities.OsuBeatmapEntity;
import antoine.rythm.pojos.Audio;
import antoine.rythm.repositories.OsuArchiveRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OsuArchiveService {
	private final OsuArchiveRepository repository;

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

		archive.setBeatmaps(extractBeatmaps(fileName, osuArchive.getBytes()));

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

	public Optional<OsuArchiveEntity> findByCode(String code) {
		return repository.findByCode(code);
	}

	private static ZipFile asZipFile(String fileName, byte[] archive) throws IOException {
		File temp = File.createTempFile(fileName, ".osz");
		try (OutputStream outputStream = new FileOutputStream(temp)) {
			outputStream.write(archive);

			return new ZipFile(temp);
		}
	}

	private static ZipEntry getLargestEntry(ZipFile zip) {
		return zip.stream()
				.sorted((left, right) -> Long.compare(right.getSize(), left.getSize()))
				.findFirst()
				.get();
	}

	private static Audio extractAudio(String fileName, byte[] archive) throws IOException {
		ZipFile zip = asZipFile(fileName, archive);

		ZipEntry audio = getLargestEntry(zip);
		InputStream stream = zip.getInputStream(audio);
		String[] split = audio.getName().split("\\.");
		String format = split[split.length - 1];

		return new Audio(stream.readAllBytes(), format);
	}

	private static List<OsuBeatmapEntity> extractBeatmaps(String fileName, byte[] archive) throws IOException {
		ZipFile zip = asZipFile(fileName, archive);

		return zip.stream()
				.map(entry -> entry.getName())
				.filter(name -> name.endsWith(".osu"))
				.distinct()
				.sorted()
				.map(name -> {
					OsuBeatmapEntity beatmap = new OsuBeatmapEntity();
					beatmap.setBeatmapFileName(name);
					beatmap.setBeatmapContent(content(zip, name));

					beatmap.setArtist(name.split(" - ")[0]);
					beatmap.setSong(name.substring(name.indexOf(" - ") + 3, name.indexOf("(") - 1));

					beatmap.setDifficulty(name.substring(name.indexOf("[") + 1, name.indexOf("]")));
					beatmap.setCreator(name.substring(name.indexOf("(") + 1, name.indexOf(")")));

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
