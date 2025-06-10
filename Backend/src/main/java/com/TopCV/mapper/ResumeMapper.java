package com.TopCV.mapper;

import com.TopCV.dto.request.ResumeRequest;
import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Resume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ResumeMapper {
    ResumeMapper INSTANCE = Mappers.getMapper(ResumeMapper.class);

    @Mapping(target = "resumeId", source = "id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "downloadUrl", expression = "java(\"/api/v1/resumes/download/\" + resume.getId())")
    ResumeResponse toResponse(Resume resume);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Resume toEntity(ResumeRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(ResumeRequest request, @MappingTarget Resume resume);
}
