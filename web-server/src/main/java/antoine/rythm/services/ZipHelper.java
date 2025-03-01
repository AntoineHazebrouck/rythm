package antoine.rythm.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.zip.ZipFile;

class ZipHelper {
	public static ZipFile asZipFile(String fileName, byte[] archive) throws IOException {
		File temp = File.createTempFile(fileName, ".osz");
		try (OutputStream outputStream = new FileOutputStream(temp)) {
			outputStream.write(archive);

			return new ZipFile(temp);
		}
	}
}
