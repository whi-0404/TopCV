package com.TopCV.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "python-service")
@Data
public class PythonServiceConfig {
    private String baseUrl = "http://localhost:8000";
    private int timeoutSeconds = 30;
    private Endpoints endpoints = new Endpoints();
    
    @Data
    public static class Endpoints {
        private String cvUpload = "/cv/upload";
        private String jobScreening = "/screening/apply-job";
        private String jobSync = "/jobs/sync-from-backend";
        private String jobUpload = "/jobs/upload";
        private String clearJobs = "/jobs/clear";
    }
} 