import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class TranslationClientGUI extends JFrame {
    private JTextField inputField;
    private JLabel resultLabel;
    private JTextArea clientLogArea;

    public TranslationClientGUI() {
        setTitle("TCP Translation Client");
        setSize(400, 250);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new GridLayout(5, 1, 10, 10));

        inputField = new JTextField();
        JButton btn = new JButton("Translate Word");
        resultLabel = new JLabel("Translation: ---", SwingConstants.CENTER);
        resultLabel.setForeground(Color.BLUE);
        // Use a font that supports Arabic
        resultLabel.setFont(new Font("Tahoma", Font.BOLD, 14));

        clientLogArea = new JTextArea();
        clientLogArea.setEditable(false);
        clientLogArea.setBackground(Color.DARK_GRAY);
        clientLogArea.setForeground(Color.GREEN);
        // Use a font that supports Arabic characters
        clientLogArea.setFont(new Font("Tahoma", Font.PLAIN, 12));
        JScrollPane logScroll = new JScrollPane(clientLogArea);
        logScroll.setPreferredSize(new Dimension(200, 80));

        add(new JLabel("Enter English Word:", SwingConstants.CENTER));
        add(inputField);
        add(btn);
        add(resultLabel);
        add(logScroll);

        JButton saveBtn = new JButton("Save Translation");
        JButton openLibBtn = new JButton("Open Library");
        JPanel controlRow = new JPanel(new FlowLayout(FlowLayout.CENTER));
        controlRow.add(saveBtn);
        controlRow.add(openLibBtn);
        add(controlRow);

        btn.addActionListener(e -> requestTranslation());
        saveBtn.addActionListener(e -> saveCurrentTranslation());
        openLibBtn.addActionListener(e -> openLibraryWindow());

        setLocationRelativeTo(null);
        setVisible(true);
    }

    private String lastWord = null;
    private String lastTranslation = null;

    private void requestTranslation() {
        String word = inputField.getText().trim();
        if (word.isEmpty()) {
            appendClientLog("[INPUT] No word entered.");
            return;
        }

        //من اول هنا 
        new Thread(() -> {
            appendClientLog("[ACTION] Attempting to connect to server (initiating TCP three-way handshake)...");
            try (Socket socket = new Socket("localhost", 5000);
                 PrintWriter out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true);
                 BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8))) {

                appendClientLog("[HANDSHAKE] Connection established with server: " + socket.getInetAddress());
                appendClientLog("[SEND] Sending word: " + word + " (" + word.getBytes(java.nio.charset.StandardCharsets.UTF_8).length + " bytes)");
                out.println(word); // Sending via TCP

                appendClientLog("[FLOW] Waiting for server response...");
                String response = in.readLine(); // Receiving via TCP (blocks until newline)
                if (response != null) {
                    appendClientLog("[RECV] Received translation (" + response.getBytes(java.nio.charset.StandardCharsets.UTF_8).length + " bytes)");
                    lastWord = word;
                    lastTranslation = response;
                    SwingUtilities.invokeLater(() -> resultLabel.setText("Translation: " + response));
                } else {
                    appendClientLog("[RECV] No response (server closed connection).");
                    lastWord = word;
                    lastTranslation = "Not Found";
                    SwingUtilities.invokeLater(() -> resultLabel.setText("Translation: Not Found"));
                }

            } catch (IOException e) {
                appendClientLog("[ERR] " + e.getMessage());
                lastWord = word;
                lastTranslation = "Error: Server Offline";
                SwingUtilities.invokeLater(() -> resultLabel.setText("Error: Server Offline"));
            }
        }).start();
    }

    private void saveCurrentTranslation() {
        if (lastWord == null || lastTranslation == null) {
            appendClientLog("[LIB] Nothing to save. Do a translation first.");
            return;
        }
        try {
            java.nio.file.Path lib = java.nio.file.Paths.get("networkClient", "library.json");
            String entry = "{\"word\":\"" + escapeToJson(lastWord) + "\",\"translation\":\"" + escapeToJson(lastTranslation) + "\",\"timestamp\":\"" + System.currentTimeMillis() + "\"}";
            if (!java.nio.file.Files.exists(lib)) {
                java.nio.file.Files.createDirectories(lib.getParent());
                java.nio.file.Files.write(lib, "[".getBytes(java.nio.charset.StandardCharsets.UTF_8));
                java.nio.file.Files.write(lib, "]".getBytes(java.nio.charset.StandardCharsets.UTF_8), java.nio.file.StandardOpenOption.APPEND);
            }
            // naive append into array
            String existing = new String(java.nio.file.Files.readAllBytes(lib), java.nio.charset.StandardCharsets.UTF_8).trim();
            String out;
            if (existing.equals("[]") || existing.length() == 0) out = "[" + entry + "]";
            else out = existing.substring(0, existing.length() - 1) + "," + entry + "]";
            java.nio.file.Files.write(lib, out.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            appendClientLog("[LIB] Saved translation: " + lastWord + " -> " + lastTranslation);
        } catch (IOException e) {
            appendClientLog("[ERR] Saving to library failed: " + e.getMessage());
        }
    }

    private String escapeToJson(String s) {
        StringBuilder out = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '\\') out.append("\\\\");
            else if (c == '"') out.append("\\\"");
            else if (c > 127) out.append(String.format("\\u%04x", (int) c));
            else out.append(c);
        }
        return out.toString();
    }

    private void appendClientLog(String message) {
        if (clientLogArea != null) {
            SwingUtilities.invokeLater(() -> {
                clientLogArea.append(message + "\n");
            });
        }
    }

//لحد هنا 
    private void openLibraryWindow() {
        JFrame libFrame = new JFrame("Translation Library");
        libFrame.setSize(600, 400);
        libFrame.setLocationRelativeTo(this);

        String[] cols = {"Word", "Translation", "Timestamp"};
        java.util.List<String[]> rows = new java.util.ArrayList<>();
        java.nio.file.Path lib = java.nio.file.Paths.get("networkClient", "library.json");
        if (java.nio.file.Files.exists(lib)) {
            try {
                String content = new String(java.nio.file.Files.readAllBytes(lib), java.nio.charset.StandardCharsets.UTF_8);
                java.util.regex.Pattern obj = java.util.regex.Pattern.compile("\\{(.*?)\\}");
                java.util.regex.Matcher m = obj.matcher(content);
                while (m.find()) {
                    String o = m.group(1);
                    String w = extractField(o, "word");
                    String t = extractField(o, "translation");
                    String ts = extractField(o, "timestamp");
                    rows.add(new String[]{w, t, ts});
                }
            } catch (IOException e) {
                appendClientLog("[ERR] Reading library failed: " + e.getMessage());
            }
        }

        String[][] data = rows.toArray(new String[0][0]);
        JTable table = new JTable(data, cols);
        JScrollPane sp = new JScrollPane(table);

        JButton exportBtn = new JButton("Export CSV");
        JButton deleteBtn = new JButton("Delete Selected");
        JPanel btnRow = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        btnRow.add(exportBtn);
        btnRow.add(deleteBtn);

        exportBtn.addActionListener(e -> {
            java.io.File file = new java.io.File("networkClient/library_export.csv");
            try (java.io.PrintWriter pw = new java.io.PrintWriter(new java.io.OutputStreamWriter(new java.io.FileOutputStream(file), java.nio.charset.StandardCharsets.UTF_8))) {
                pw.println("word,translation,timestamp");
                for (int r = 0; r < table.getRowCount(); r++) {
                    pw.println(table.getValueAt(r, 0) + "," + table.getValueAt(r, 1) + "," + table.getValueAt(r, 2));
                }
                appendClientLog("[LIB] Exported to " + file.getAbsolutePath());
            } catch (IOException ex) {
                appendClientLog("[ERR] Export failed: " + ex.getMessage());
            }
        });

        deleteBtn.addActionListener(e -> {
            int sel = table.getSelectedRow();
            if (sel < 0) return;
            // remove from in-memory and write back
            java.util.List<String> newObjs = new java.util.ArrayList<>();
            java.nio.file.Path libp = java.nio.file.Paths.get("networkClient", "library.json");
            if (java.nio.file.Files.exists(libp)) {
                try {
                    String content = new String(java.nio.file.Files.readAllBytes(libp), java.nio.charset.StandardCharsets.UTF_8);
                    java.util.regex.Pattern obj = java.util.regex.Pattern.compile("\\{(.*?)\\}");
                    java.util.regex.Matcher m = obj.matcher(content);
                    int idx = 0;
                    while (m.find()) {
                        String o = m.group(0);
                        if (idx != sel) newObjs.add(o);
                        idx++;
                    }
                    String out = "[" + String.join(",", newObjs) + "]";
                    java.nio.file.Files.write(libp, out.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                    appendClientLog("[LIB] Deleted item at index " + sel);
                    libFrame.dispose();
                    openLibraryWindow();
                } catch (IOException ex) {
                    appendClientLog("[ERR] Delete failed: " + ex.getMessage());
                }
            }
        });

        libFrame.add(sp, BorderLayout.CENTER);
        libFrame.add(btnRow, BorderLayout.SOUTH);
        libFrame.setVisible(true);
    }

    private String extractField(String objContent, String key) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("\"" + key + "\"\s*:\s*\\\"(.*?)\\\"");
        java.util.regex.Matcher m = p.matcher(objContent);
        if (m.find()) return unescapeJsonString(m.group(1));
        return "";
    }

    private String unescapeJsonString(String s) {
        java.util.regex.Pattern u = java.util.regex.Pattern.compile("\\\\u([0-9a-fA-F]{4})");
        java.util.regex.Matcher mm = u.matcher(s);
        StringBuffer sb = new StringBuffer();
        while (mm.find()) {
            int code = Integer.parseInt(mm.group(1), 16);
            mm.appendReplacement(sb, Character.toString((char) code));
        }
        mm.appendTail(sb);
        return sb.toString().replaceAll("\\\\\"", "\"").replaceAll("\\\\n", "\n");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TranslationClientGUI());
    }
}