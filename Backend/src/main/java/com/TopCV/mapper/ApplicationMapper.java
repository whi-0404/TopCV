package com.TopCV.mapper;

import com.TopCV.dto.response.ApplicationResponse;
import com.TopCV.entity.Application;

public interface ApplicationMapper {
    ApplicationResponse toResponse(Application application);
    ApplicationResponse toResponseForEmployer(Application application);
}
