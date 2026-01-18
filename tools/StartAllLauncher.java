package tools;

import java.io.File;

public class StartAllLauncher {
    public static void main(String[] args) {
        try {
            File serverExe = new File("TranslationServer.exe");
            File clientExe = new File("TranslationClient.exe");

            ProcessBuilder pb1;
            ProcessBuilder pb2;

            if (serverExe.exists()) {
                pb1 = new ProcessBuilder(serverExe.getAbsolutePath());
            } else {
                pb1 = new ProcessBuilder(getJavaBin(), "-jar", "networkserver" + File.separator + "networkserver.jar");
            }

            if (clientExe.exists()) {
                pb2 = new ProcessBuilder(clientExe.getAbsolutePath());
            } else {
                pb2 = new ProcessBuilder(getJavaBin(), "-jar", "networkClient" + File.separator + "networkclient.jar");
            }

            System.out.println("Starting server with command: " + String.join(" ", pb1.command()));
            pb1.inheritIO().start();
            Thread.sleep(500);
            System.out.println("Starting client with command: " + String.join(" ", pb2.command()));
            pb2.inheritIO().start();
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static String getJavaBin() {
        String javaHome = System.getProperty("java.home");
        File javaBin = new File(javaHome, "bin" + File.separator + "java");
        return javaBin.getAbsolutePath();
    }
}