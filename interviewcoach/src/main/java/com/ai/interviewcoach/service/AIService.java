package com.ai.interviewcoach.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Service
public class AIService {

    private final WebClient faceClient;
    private final WebClient textClient;

    public AIService(
            @Value("${ai.face.url}") String faceUrl,
            @Value("${ai.text.url}") String textUrl) {
        this.faceClient = WebClient.builder().baseUrl(faceUrl).build();
        this.textClient = WebClient.builder().baseUrl(textUrl).build();
    }

    private ResponseEntity<?> call(WebClient client, String route, Map<String, Object> body) {
        try {
            String res = client.post()
                    .uri(route)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<?> analyzeVideo(Map<String, Object> body) {
        return call(faceClient, "/analysisVideo", body);
    }

    public ResponseEntity<?> generateQuestion(Map<String, Object> body) {
        return call(faceClient, "/generateQuestion", body);
    }

    public ResponseEntity<?> analyzeTextAI(Map<String, Object> body) {
        return call(textClient, "/analyze_media", body);
    }
}
