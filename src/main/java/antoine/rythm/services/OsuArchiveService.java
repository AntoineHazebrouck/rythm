package antoine.rythm.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.springframework.stereotype.Service;

import antoine.rythm.Audio;
import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.repositories.OsuArchiveRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OsuArchiveService {
	private final OsuArchiveRepository repository;

	public OsuArchiveEntity save(OsuArchiveEntity entity) {
		repository.delete(entity);
		return repository.save(entity);
	}

	public List<OsuArchiveEntity> findAll() {
		return repository.findAll();
	}

	public Optional<Audio> extractAudio(String fileName) throws IOException {
		Optional<OsuArchiveEntity> archive = repository.findById(fileName);
		if (archive.isEmpty()) {
			return Optional.empty();
		} else {
			ZipFile zip = asZipFile(archive.get());

			ZipEntry audio = getLargestEntry(zip);
			InputStream stream = zip.getInputStream(audio);
			String[] split = audio.getName().split("\\.");
			String format = split[split.length - 1];

			return Optional.of(new Audio(stream.readAllBytes(), format));
		}

	}

	public Optional<String> extractBeatmapContent(String archiveName, String beatmapName) throws IOException {
		Optional<OsuArchiveEntity> archive = repository.findById(archiveName);
		if (archive.isEmpty()) {
			return Optional.empty();
		} else {
			ZipFile zip = asZipFile(archive.get());

			InputStream stream = zip.getInputStream(zip.getEntry(beatmapName));
			return Optional.of(new String(stream.readAllBytes()));
		}
	}

	public Optional<List<String>> extractBeatmapsNames(String archiveName) throws IOException {
		Optional<OsuArchiveEntity> archive = repository.findById(archiveName);

		if (archive.isEmpty()) {
			return Optional.empty();
		} else {
			ZipFile zip = asZipFile(archive.get());

			return Optional.of(zip.stream()
					.map(entry -> entry.getName())
					.filter(name -> name.endsWith(".osu"))
					.distinct()
					.sorted()
					.toList());
		}
	}

	// public void setCurrentArchive(MultipartFile osuArchive) throws IOException {
	// File temp = File.createTempFile("temp", ".osz");
	// osuArchive.transferTo(temp);

	// this.zip = new ZipFile(temp);
	// }

	private static ZipEntry getLargestEntry(ZipFile zip) {
		// Set<ZipEntry> entries = new HashSet<>();
		// zip.entries().asIterator().forEachRemaining(entry -> {
		// entries.add(entry);
		// });

		return zip.stream().sorted(new Comparator<ZipEntry>() {

			@Override
			public int compare(ZipEntry left, ZipEntry right) {
				return Long.compare(right.getSize(), left.getSize());
			}

		}).findFirst().get();
	}

	private static ZipFile asZipFile(OsuArchiveEntity osuArchiveEntity) throws IOException {
		File temp = File.createTempFile(osuArchiveEntity.getName(), ".osz");
		try (OutputStream outputStream = new FileOutputStream(temp)) {
			outputStream.write(osuArchiveEntity.getArchive());

			return new ZipFile(temp);
		}
	}
}
