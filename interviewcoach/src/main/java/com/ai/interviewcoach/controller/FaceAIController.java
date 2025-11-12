package com.ai.interviewcoach.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/faceai")
public class FaceAIController {

    private final WebClient faceWebClient;
    private final WebClient textWebClient;

    public FaceAIController(
            @Value("${faceai.url:http://localhost:5001}") String faceAiUrl,
            @Value("${textai.url:http://localhost:8000}") String textAiUrl) {

        this.faceWebClient = WebClient.builder()
                .baseUrl(faceAiUrl)
                .build();

        this.textWebClient = WebClient.builder()
                .baseUrl(textAiUrl)
                .build();
    }

    @PostMapping(value = "/analyzeVideo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<String> analyzeVideo(@RequestPart("video") MultipartFile file) {

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("video", file.getResource())
                .filename(file.getOriginalFilename())
                .contentType(MediaType.APPLICATION_OCTET_STREAM);

        return faceWebClient.post()
                .uri("/analyzeVideo")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(builder.build())
                .retrieve()
                .bodyToMono(String.class);
    }

    // Existing TextAI route
    @PostMapping(value = "/analyze_media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public Mono<String> analyzeWithTextAI(@RequestPart("video") MultipartFile file) {
                MultipartBodyBuilder builder = new MultipartBodyBuilder();
                builder.part("video", file.getResource())
                        .filename(file.getOriginalFilename())
                        .contentType(MediaType.APPLICATION_OCTET_STREAM);

                return textWebClient.post()
                        .uri("/analyze_media")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .bodyValue(builder.build())
                        .retrieve()
                        .bodyToMono(String.class);
        }

        // **New combined route**
        @PostMapping(value = "/analyzeCombined", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public Mono<Map<String, Object>> analyzeCombined(@RequestPart("video") MultipartFile file) {
        try {
                // ✅ Read file into bytes once
                byte[] fileBytes = file.getBytes();
                String filename = file.getOriginalFilename();

                // ✅ Create FaceAI multipart body
                MultipartBodyBuilder faceBuilder = new MultipartBodyBuilder();
                faceBuilder.part("video", fileBytes)
                        .filename(filename)
                        .contentType(MediaType.APPLICATION_OCTET_STREAM);

                // ✅ Create TextAI multipart body (reuse bytes)
                MultipartBodyBuilder textBuilder = new MultipartBodyBuilder();
                textBuilder.part("video", fileBytes)
                        .filename(filename)
                        .contentType(MediaType.APPLICATION_OCTET_STREAM);

                // ✅ Send to FaceAI
                Mono<Map> faceResult = faceWebClient.post()
                        .uri("/analyzeVideo")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .bodyValue(faceBuilder.build())
                        .retrieve()
                        .bodyToMono(Map.class)
                        .doOnNext(res -> System.out.println("✅ FaceAI Response: " + res));

                // ✅ Send to TextAI
                Mono<Map> textResult = textWebClient.post()
                        .uri("/analyze_media")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .bodyValue(textBuilder.build())
                        .retrieve()
                        .bodyToMono(Map.class)
                        .doOnNext(res -> System.out.println("✅ TextAI Response: " + res))
                        .onErrorResume(e -> {
                        Map<String, Object> fallback = new HashMap<>();
                        fallback.put("error", "TextAI rate limit reached. Please retry after some time.");
                        return Mono.just(fallback);
                        });

                // ✅ Combine results
                return Mono.zip(faceResult, textResult)
                        .map(tuple -> {
                        Map<String, Object> combined = new HashMap<>();
                        combined.putAll(tuple.getT1());
                        combined.put("text_analysis", tuple.getT2());
                        return combined;
                        });

        } catch (Exception e) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Exception during processing: " + e.getMessage());
                return Mono.just(error);
        }
}


}


