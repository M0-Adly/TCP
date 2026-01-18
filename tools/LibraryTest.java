package tools;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;

public class LibraryTest {
    public static void main(String[] args) throws Exception {
        java.nio.file.Path lib = Paths.get("networkClient","library.json");
        if (!Files.exists(lib)) {
            Files.write(lib, "[]".getBytes(StandardCharsets.UTF_8));
        }
        String entry = "{\"word\":\"network\",\"translation\":\"شبكة\",\"timestamp\":\""+System.currentTimeMillis()+"\"}";
        String existing = new String(Files.readAllBytes(lib), StandardCharsets.UTF_8).trim();
        String out;
        if (existing.equals("[]") || existing.length() == 0) out = "[" + entry + "]";
        else out = existing.substring(0, existing.length() - 1) + "," + entry + "]";
        Files.write(lib, out.getBytes(StandardCharsets.UTF_8));
        System.out.println("Wrote library entry. Now reading back:");
        System.out.println(new String(Files.readAllBytes(lib), StandardCharsets.UTF_8));
    }
}