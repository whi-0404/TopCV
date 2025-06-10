package com.TopCV.dto.external;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PythonJobData {
    
    @com.fasterxml.jackson.annotation.JsonProperty("job_id")
    String jobId;
    
    @com.fasterxml.jackson.annotation.JsonProperty("job_title")
    String jobTitle;
    
    String company;
    String location;
    
    @com.fasterxml.jackson.annotation.JsonProperty("job_type")
    String jobType;
    
    // Job requirements
    @com.fasterxml.jackson.annotation.JsonProperty("required_skills")
    List<String> requiredSkills;
    
    @com.fasterxml.jackson.annotation.JsonProperty("min_experience")
    Integer minExperience;
    
    @com.fasterxml.jackson.annotation.JsonProperty("education_requirement")
    String educationRequirement;
    
    // Job description
    @com.fasterxml.jackson.annotation.JsonProperty("job_description")
    String jobDescription;
    
    List<String> responsibilities;
    List<String> benefits;
    
    // Metadata
    @com.fasterxml.jackson.annotation.JsonProperty("posted_date")
    LocalDateTime postedDate;
    
    LocalDate deadline;
    
    // Additional fields for matching
    String salary;
    
    @com.fasterxml.jackson.annotation.JsonProperty("working_time")
    String workingTime;
    
    @com.fasterxml.jackson.annotation.JsonProperty("experience_required")
    String experienceRequired;
    
    @com.fasterxml.jackson.annotation.JsonProperty("company_logo")
    String companyLogo;
    
    public static PythonJobData fromJobPost(com.TopCV.entity.JobPost jobPost) {
        return PythonJobData.builder()
                .jobId(String.valueOf(jobPost.getId()))
                .jobTitle(jobPost.getTitle())
                .company(jobPost.getCompany() != null ? jobPost.getCompany().getName() : "")
                .location(jobPost.getLocation())
                .jobType(jobPost.getType() != null ? jobPost.getType().getName() : "")
                .requiredSkills(jobPost.getSkills() != null ? 
                    jobPost.getSkills().stream().map(skill -> skill.getName()).toList() : 
                    List.of())
                .minExperience(extractMinExperienceFromText(jobPost.getExperienceRequired()))
                .educationRequirement("")  // Không có field này trong entity hiện tại
                .jobDescription(jobPost.getDescription())
                .responsibilities(parseResponsibilities(jobPost.getRequirements())) // Parse từ requirements
                .benefits(parseBenefits(jobPost.getBenefits()))
                .postedDate(jobPost.getCreatedAt())
                .deadline(jobPost.getDeadline())
                .salary(jobPost.getSalary())
                .workingTime(jobPost.getWorkingTime())
                .experienceRequired(jobPost.getExperienceRequired())
                .companyLogo(jobPost.getCompany() != null ? jobPost.getCompany().getLogo() : "")
                .build();
    }
    
    private static Integer extractMinExperienceFromText(String experienceText) {
        if (experienceText == null || experienceText.isEmpty()) {
            return 0;
        }
        
        // Extract số năm từ text như "2-3 năm kinh nghiệm", "Fresher", etc.
        String text = experienceText.toLowerCase();
        
        if (text.contains("fresher") || text.contains("no experience")) {
            return 0;
        }
        
        // Tìm pattern số-số năm
        if (text.matches(".*\\d+-\\d+.*")) {
            String[] parts = text.split("-");
            try {
                return Integer.parseInt(parts[0].replaceAll("\\D", ""));
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        
        // Tìm số đầu tiên
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d+");
        java.util.regex.Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group());
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        
        return 0;
    }
    
    private static List<String> parseResponsibilities(String requirements) {
        if (requirements == null || requirements.isEmpty()) {
            return List.of();
        }
        
        // Parse responsibilities từ requirements text
        // Có thể split by newline, bullet points, etc.
        return List.of(requirements.split("\n"));
    }
    
    private static List<String> parseBenefits(String benefits) {
        if (benefits == null || benefits.isEmpty()) {
            return List.of();
        }
        
        // Parse benefits từ text
        return List.of(benefits.split("\n"));
    }
} 