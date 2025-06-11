package com.TopCV.mapper;

import com.TopCV.dto.request.JobLevelRequest;
import com.TopCV.dto.response.JobLevelResponse;
import com.TopCV.entity.JobLevel;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-08T22:32:10+0700",
    comments = "version: 1.6.2, compiler: javac, environment: Java 23-valhalla (Oracle Corporation)"
)
@Component
public class JobLevelMapperImpl implements JobLevelMapper {

    @Override
    public JobLevel toEntity(JobLevelRequest request) {
        if ( request == null ) {
            return null;
        }

        JobLevel.JobLevelBuilder jobLevel = JobLevel.builder();

        jobLevel.name( request.getName() );

        return jobLevel.build();
    }

    @Override
    public JobLevelResponse toResponse(JobLevel jobLevel) {
        if ( jobLevel == null ) {
            return null;
        }

        JobLevelResponse.JobLevelResponseBuilder jobLevelResponse = JobLevelResponse.builder();

        jobLevelResponse.id( jobLevel.getId() );
        jobLevelResponse.name( jobLevel.getName() );

        return jobLevelResponse.build();
    }

    @Override
    public void updateEntity(JobLevel jobLevel, JobLevelRequest request) {
        if ( request == null ) {
            return;
        }

        jobLevel.setName( request.getName() );
    }
}
