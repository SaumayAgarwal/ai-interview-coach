package com.ai.interviewcoach.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class QuestionController {

    private final WebClient webClient;

    public QuestionController(@Value("${faceai.url:http://localhost:5001}") String faceAiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(faceAiUrl)
                .build();
    }

    @PostMapping(value = "/generate", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> generateQuestions(@RequestBody Map<String, Object> requestData) {
        return webClient.post()
                .uri("/generateQuestions")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestData)
                .retrieve()
                .bodyToMono(String.class);
    }
}
