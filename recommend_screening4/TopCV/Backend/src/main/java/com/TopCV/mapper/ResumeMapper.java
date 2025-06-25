package com.TopCV.mapper;

import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Resume;

public interface ResumeMapper {
    ResumeResponse toResponse(Resume resume);
}
