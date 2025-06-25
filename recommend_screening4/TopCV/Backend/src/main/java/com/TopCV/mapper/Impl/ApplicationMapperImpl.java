package com.TopCV.mapper.Impl;

import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.entity.Application;
import com.TopCV.mapper.ApplicationMapper;
import com.TopCV.mapper.JobPostMapper;
import com.TopCV.mapper.UserMapper;
import com.TopCV.mapper.ResumeMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationMapperImpl implements ApplicationMapper {
    private final JobPostMapper jobPostMapper;
    private final UserMapper userMapper;
    private final ResumeMapper resumeMapper;
    private final ObjectMapper objectMapper;

    public ApplicationResponse toResponse(Application application){
        if (application == null) {
            return null;
        }
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobPost(jobPostMapper.toJobPostDashboard(application.getJobPost()))
                .createdAt(application.getCreatedAt())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .resume(application.getResumes() != null ? resumeMapper.toResponse(application.getResumes()) : null)
                .screeningResult(buildScreeningInfo(application))
                .build();
    }

    public ApplicationResponse toResponseForEmployer(Application application){
        if (application == null) {
            return null;
        }
        
        log.info("Mapping application {} for employer view", application.getId());
        log.info("Application has resume: {}", application.getResumes() != null);
        if (application.getResumes() != null) {
            log.info("Resume ID: {}, Original filename: {}", 
                application.getResumes().getId(), 
                application.getResumes().getOriginalFilename());
        }
        
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobPost(jobPostMapper.toJobPostDashboard(application.getJobPost()))
                .user(userMapper.toDashBoardUser(application.getUser()))
                .createdAt(application.getCreatedAt())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .resume(application.getResumes() != null ? resumeMapper.toResponse(application.getResumes()) : null)
                .screeningResult(buildScreeningInfo(application))
                .build();
    }

    private ApplicationResponse.CVScreeningInfo buildScreeningInfo(Application application) {
        if (application.getScreeningDecision() == null) {
            return null;
        }

        try {
            List<String> matchingPoints = parseJsonStringList(application.getMatchingPoints());
            List<String> notMatchingPoints = parseJsonStringList(application.getNotMatchingPoints());

            return ApplicationResponse.CVScreeningInfo.builder()
                    .candidateDecision(application.getScreeningDecision())
                    .overallScore(application.getScreeningScore())
                    .matchingPoints(matchingPoints)
                    .notMatchingPoints(notMatchingPoints)
                    .recommendation(application.getScreeningRecommendation())
                    .screenedAt(application.getScreenedAt())
                    .scoreLevel(determineScoreLevel(application.getScreeningScore()))
                    .decisionColor(determineDecisionColor(application.getScreeningDecision()))
                    .isRecommended("PASS".equals(application.getScreeningDecision()))
                    .build();
        } catch (Exception e) {
            log.error("Error building screening info for application {}: {}", application.getId(), e.getMessage());
            return null;
        }
    }

    private List<String> parseJsonStringList(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(jsonString, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.error("Error parsing JSON string: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private String determineScoreLevel(Double score) {
        if (score == null) return "UNKNOWN";
        if (score >= 4.0) return "EXCELLENT";
        if (score >= 3.0) return "GOOD";
        if (score >= 2.0) return "AVERAGE";
        return "POOR";
    }

    private String determineDecisionColor(String decision) {
        if (decision == null) return "GRAY";
        return switch (decision.toUpperCase()) {
            case "PASS" -> "GREEN";
            case "REVIEW" -> "YELLOW";
            case "FAIL" -> "RED";
            default -> "GRAY";
        };
    }
}
