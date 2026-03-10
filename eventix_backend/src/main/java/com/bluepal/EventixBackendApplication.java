package com.bluepal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EventixBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventixBackendApplication.class, args);
    }
}