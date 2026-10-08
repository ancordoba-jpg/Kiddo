import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.nio.file.*;

public class SimpleServer {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8765), 0);
        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/index.html";
            File file = new File("." + path);
            if (file.exists() && file.isFile()) {
                byte[] bytes = Files.readAllBytes(file.toPath());
                String ct = "text/html";
                if (path.endsWith(".js")) ct = "application/javascript";
                else if (path.endsWith(".css")) ct = "text/css";
                else if (path.endsWith(".glb")) ct = "model/gltf-binary";
                else if (path.endsWith(".png")) ct = "image/png";
                else if (path.endsWith(".jpg")) ct = "image/jpeg";
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Content-Type", ct);
                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.getResponseBody().close();
            } else {
                exchange.sendResponseHeaders(404, 0);
                exchange.getResponseBody().close();
            }
        });
        server.start();
        System.out.println("Server started at http://localhost:8765");
    }
}
