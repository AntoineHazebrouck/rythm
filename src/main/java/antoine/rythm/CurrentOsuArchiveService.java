package antoine.rythm;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CurrentOsuArchiveService {
	private ZipFile zip;

	public Audio extractAudio() throws IOException {
		ZipEntry audio = getLargestEntry(zip);
		InputStream stream = zip.getInputStream(audio);
		String[] split = audio.getName().split("\\.");
		String format = split[split.length - 1];

		return new Audio(stream.readAllBytes(), format);
	}

	public String extractBeatmapContent(String name) throws IOException {
		InputStream stream = zip.getInputStream(zip.getEntry(name));
		return new String(stream.readAllBytes());
	}

	public Set<String> extractBeatmapsNames() {
		Set<String> names = new HashSet<>();
		Iterator<? extends ZipEntry> iterator = zip.entries().asIterator();
		while (iterator.hasNext()) {
			var name = iterator.next().getName();
			if (name.endsWith(".osu")) {
				names.add(name);
			}
		}
		return names;
	}

	public void setCurrentArchive(MultipartFile osuArchive) throws IOException {
		File temp = File.createTempFile("temp", ".osz");
		osuArchive.transferTo(temp);

		this.zip = new ZipFile(temp);
	}

	private static ZipEntry getLargestEntry(ZipFile zip) {
		Set<ZipEntry> entries = new HashSet<>();
		zip.entries().asIterator().forEachRemaining(entry -> {
			entries.add(entry);
		});

		return entries.stream().sorted(new Comparator<ZipEntry>() {

			@Override
			public int compare(ZipEntry left, ZipEntry right) {
				return Long.compare(right.getSize(), left.getSize());
			}

		}).findFirst().get();
	}
}
