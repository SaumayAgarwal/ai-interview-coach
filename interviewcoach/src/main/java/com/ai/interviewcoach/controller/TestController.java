package com.ai.interviewcoach.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "✅ Backend is running successfully on port 8080!";
    }

    @GetMapping("/ping")
    public String ping() {
        return "Pong!";
    }
}
