import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.net.*;
import java.util.HashMap;

public class TranslationServerGUI extends JFrame {
    private JTextArea logArea;
    private HashMap<String, String> dictionary;

    public TranslationServerGUI() {
        setTitle("TCP Translation Server (Networking Project)");
        setSize(500, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        logArea = new JTextArea();
        logArea.setEditable(false);
        logArea.setBackground(Color.DARK_GRAY);
        logArea.setForeground(Color.CYAN);
        logArea.setFont(new Font("Monospaced", Font.PLAIN, 13));
        
        add(new JScrollPane(logArea), BorderLayout.CENTER);
        
        // Dictionary Data
        dictionary = new HashMap<>();
        dictionary.put("network", "شبكة");
        dictionary.put("protocol", "بروتوكول");
        dictionary.put("server", "خادم");
        dictionary.put("client", "عميل");
        dictionary.put("socket", "مقبس توصيل");

        setVisible(true);
        startServer();
    }

    private void startServer() {
        new Thread(() -> {
            try (ServerSocket serverSocket = new ServerSocket(5000)) {
                logArea.append("[SYSTEM] TCP Server started on port 5000...\n");
                logArea.append("[SYSTEM] Waiting for Three-way Handshake...\n");

                while (true) {
                    Socket clientSocket = serverSocket.accept(); // Handshake completes
                    logArea.append("[CONN] Client connected: " + clientSocket.getInetAddress() + "\n");

                    BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                    PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

                    String word = in.readLine();
                    if (word != null) {
                        logArea.append("[REQ] Word received: " + word + "\n");
                        String translation = dictionary.getOrDefault(word.toLowerCase(), "Not Found in DB");
                        out.println(translation);
                        logArea.append("[RES] Sent translation: " + translation + "\n");
                    }
                    clientSocket.close();
                    logArea.append("[DISCONN] Connection closed.\n----------------------\n");
                }
            } catch (IOException e) {
                logArea.append("[ERR] Server Error: " + e.getMessage());
            }
        }).start();
    }

    public static void main(String[] args) {
        new TranslationServerGUI();
    }
}