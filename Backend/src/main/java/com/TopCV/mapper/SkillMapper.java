package com.TopCV.mapper;


import com.TopCV.dto.request.SkillRequest;
import com.TopCV.dto.response.SkillResponse;
import com.TopCV.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SkillMapper {
    Skill toEntity(SkillRequest request);
    SkillResponse toResponse(Skill skill);
    void updateEntity(@MappingTarget Skill skill, SkillRequest request);
}