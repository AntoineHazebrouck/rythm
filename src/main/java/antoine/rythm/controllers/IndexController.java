package antoine.rythm.controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import antoine.rythm.entities.OsuArchiveEntity;
import antoine.rythm.entities.OsuBeatmapEntity;
import antoine.rythm.pojos.Audio;
import antoine.rythm.services.OsuArchiveService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
class IndexController {
	private final OsuArchiveService osuArchiveService;

	@GetMapping
	public String index() {
		return "index";
	}

	@PostMapping(path = "/load-osu-archive")
	public RedirectView postMethodName(
			@RequestParam("osu-archive") MultipartFile osuArchive) throws IOException {

		String fileName = osuArchive.getOriginalFilename();

		OsuArchiveEntity archive = new OsuArchiveEntity();
		archive.setArchiveFileName(fileName);

		archive.setCode(fileName.substring(0, 7));

		String withoutCode = fileName.substring(7, fileName.length() - 4);
		archive.setArtist(withoutCode.split(" - ")[0]);
		archive.setSong(withoutCode.split(" - ")[1]);

		Audio audio = extractAudio(fileName, osuArchive.getBytes());
		archive.setAudio(audio.getData());
		archive.setAudioFormat(audio.getFormat());

		archive.setBeatmaps(extractBeatmaps(fileName, osuArchive.getBytes()));

		archive.setArchive(osuArchive.getBytes());
		osuArchiveService.save(archive);

		return new RedirectView("/archive-selection");
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

	public Audio extractAudio(String fileName, byte[] archive) throws IOException {
		ZipFile zip = asZipFile(fileName, archive);

		ZipEntry audio = getLargestEntry(zip);
		InputStream stream = zip.getInputStream(audio);
		String[] split = audio.getName().split("\\.");
		String format = split[split.length - 1];

		return new Audio(stream.readAllBytes(), format);
	}

	public Set<OsuBeatmapEntity> extractBeatmaps(String fileName, byte[] archive) throws IOException {
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
					return beatmap;
				})
				.collect(Collectors.toSet());

	}

	private String content(ZipFile zip, String beatmapName) {
		try (InputStream stream = zip.getInputStream(zip.getEntry(beatmapName))) {
			return new String(stream.readAllBytes());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
