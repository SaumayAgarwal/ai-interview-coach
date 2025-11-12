package com.ai.interviewcoach.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/textai")
public class TextAIController {

    private final WebClient webClient;

    public TextAIController(@Value("${textai.url:http://localhost:8000}") String textAiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(textAiUrl)
                .build();
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<String> analyzeTextAI(@RequestPart("file") MultipartFile file) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", file.getResource())
                .filename(file.getOriginalFilename())
                .contentType(MediaType.APPLICATION_OCTET_STREAM);

        // Forward video to TextAI Flask service
        return webClient.post()
                .uri("/analyze_media")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(builder.build())
                .retrieve()
                .bodyToMono(String.class);
    }
}
