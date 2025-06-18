package com.TopCV.mapper.Impl;

import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Resume;
import com.TopCV.mapper.ResumeMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ResumeMapperImpl implements ResumeMapper {

    @Override
    public ResumeResponse toResponse(Resume resume) {
        if (resume == null) {
            log.warn("Resume is null, returning null response");
            return null;
        }
        
        log.info("Mapping resume ID {} to response", resume.getId());
        
        ResumeResponse response = new ResumeResponse();
        response.setResumeId(resume.getId());
        response.setUserId(resume.getUser() != null ? resume.getUser().getId() : null);
        response.setFilePath(resume.getFilePath());
        response.setOriginalFileName(resume.getOriginalFilename());
        response.setCreatedAt(resume.getCreatedAt());
        response.setUpdatedAt(resume.getUpdatedAt());
        response.setDownloadUrl("/api/v1/resumes/download/" + resume.getId());
        
        log.info("Mapped resume: ID={}, filename={}, downloadUrl={}", 
            response.getResumeId(), response.getOriginalFileName(), response.getDownloadUrl());
        
        return response;
    }
} 