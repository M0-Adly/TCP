package tools;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DictionaryUtil {
    public static Map<String, String> loadFromJson(Path p) throws IOException {
        Map<String, String> map = new HashMap<>();
        if (!Files.exists(p)) return map;
        String content = new String(Files.readAllBytes(p), StandardCharsets.UTF_8);
        Pattern pair = Pattern.compile("\"(.*?)\"\s*:\s*\"(.*?)\"", Pattern.DOTALL);
        Matcher m = pair.matcher(content);
        while (m.find()) {
            String k = unescapeJsonString(m.group(1));
            String v = unescapeJsonString(m.group(2));
            map.put(k, v);
        }
        return map;
    }

    public static String unescapeJsonString(String s) {
        Pattern u = Pattern.compile("\\\\u([0-9a-fA-F]{4})");
        Matcher mm = u.matcher(s);
        StringBuffer sb = new StringBuffer();
        while (mm.find()) {
            int code = Integer.parseInt(mm.group(1), 16);
            mm.appendReplacement(sb, Character.toString((char) code));
        }
        mm.appendTail(sb);
        return sb.toString().replaceAll("\\\\\"", "\"").replaceAll("\\\\n", "\n");
    }
}