package com.TopCV.mapper;

import com.TopCV.dto.request.JobTypeRequest;
import com.TopCV.dto.response.JobTypeResponse;
import com.TopCV.entity.JobType;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-06T16:18:23+0700",
    comments = "version: 1.6.2, compiler: javac, environment: Java 23 (Oracle Corporation)"
)
@Component
public class JobTypeMapperImpl implements JobTypeMapper {

    @Override
    public JobType toEntity(JobTypeRequest request) {
        if ( request == null ) {
            return null;
        }

        JobType.JobTypeBuilder jobType = JobType.builder();

        jobType.name( request.getName() );

        return jobType.build();
    }

    @Override
    public JobTypeResponse toResponse(JobType jobType) {
        if ( jobType == null ) {
            return null;
        }

        JobTypeResponse.JobTypeResponseBuilder jobTypeResponse = JobTypeResponse.builder();

        jobTypeResponse.id( jobType.getId() );
        jobTypeResponse.name( jobType.getName() );

        return jobTypeResponse.build();
    }

    @Override
    public void updateEntity(JobType jobType, JobTypeRequest request) {
        if ( request == null ) {
            return;
        }

        jobType.setName( request.getName() );
    }
}
