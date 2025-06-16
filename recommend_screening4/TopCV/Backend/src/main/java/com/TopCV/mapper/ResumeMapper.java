package com.TopCV.mapper;

import com.TopCV.dto.response.ResumeResponse;
import com.TopCV.entity.Resume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ResumeMapper {
    @Mapping(target = "resumeId", source = "id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "downloadUrl", expression = "java(\"/api/v1/resumes/download/\" + resume.getId())")
    @Mapping(target = "originalFileName", source = "originalFilename")
    ResumeResponse toResponse(Resume resume);

//    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "user", ignore = true)
//    @Mapping(target = "filePath", ignore = true)
//    @Mapping(target = "createdAt", ignore = true)
//    @Mapping(target = "updatedAt", ignore = true)
//    Resume toEntity(ResumeRequest request);

//    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "user", ignore = true)
//    @Mapping(target = "filePath", ignore = true)
//    @Mapping(target = "createdAt", ignore = true)
//    @Mapping(target = "updatedAt", ignore = true)
//    void updateEntityFromRequest(ResumeRequest request, @MappingTarget Resume resume);
}
