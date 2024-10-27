package antoine.rythm;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class FileController {
	private ZipFile zip;

	@PostMapping(path = "/load-osu-archive")
	public RedirectView setupGame(
			@RequestParam("osu-archive") MultipartFile osuArchive)
			throws ZipException, IOException, IllegalStateException, URISyntaxException {
		File temp = File.createTempFile("temp", ".osz");
		osuArchive.transferTo(temp);

		this.zip = new ZipFile(temp);

		return new RedirectView("/setup");
	}

	@GetMapping(path = "/audio")
	public ResponseEntity<ByteArrayResource> audio() throws IOException {
		ZipEntry audio = getLargestEntry(zip);
		InputStream stream = zip.getInputStream(audio);
		String[] split = audio.getName().split("\\.");
		String format = split[split.length - 1];
		return ResponseEntity.ok()
				.contentType(MediaType.asMediaType(MimeType.valueOf("audio/" + format)))
				.body(new ByteArrayResource(stream.readAllBytes()));
	}

	@GetMapping(path = "/beatmap")
	public ResponseEntity<String> beatmap() throws IOException {
		InputStream stream = zip.getInputStream(zip.getEntry("Tan Bionica - Ciudad Magica (Midnaait) [Facil].osu"));

		return ResponseEntity.ok()
				.contentType(MediaType.TEXT_PLAIN)
				.body(new String(stream.readAllBytes()));
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
