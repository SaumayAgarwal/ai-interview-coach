package com.ai.interviewcoach.controller;

import com.ai.interviewcoach.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeVideo(@RequestBody Map<String, Object> req) {
        return aiService.analyzeVideo(req);
    }

    @PostMapping("/generateQuestion")
    public ResponseEntity<?> generateQuestion(@RequestBody Map<String, Object> req) {
        return aiService.generateQuestion(req);
    }

    @PostMapping("/analyzeTextAI")
    public ResponseEntity<?> analyzeTextAI(@RequestBody Map<String, Object> req) {
        return aiService.analyzeTextAI(req);
    }
}
