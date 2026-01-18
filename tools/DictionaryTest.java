package tools;

import java.nio.file.Paths;
import java.util.Map;

public class DictionaryTest {
    public static void main(String[] args) throws Exception {
        System.out.println("Loading data/dictionary.json...");
        Map<String,String> m = DictionaryUtil.loadFromJson(Paths.get("data","dictionary.json"));
        System.out.println("Entries: " + m.size());
        String[] test = {"network","protocol","computer","port","unknown"};
        for (String k : test) {
            String v = m.get(k);
            System.out.println(k + " -> " + (v==null?"[null]":v) + (v!=null?" ("+v.getBytes(java.nio.charset.StandardCharsets.UTF_8).length+" bytes)":""));
        }
    }
}