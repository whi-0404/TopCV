package com.TopCV.mapper;

import com.TopCV.dto.request.SkillRequest;
import com.TopCV.dto.response.SkillResponse;
import com.TopCV.entity.Skill;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-06T16:18:23+0700",
    comments = "version: 1.6.2, compiler: javac, environment: Java 23 (Oracle Corporation)"
)
@Component
public class SkillMapperImpl implements SkillMapper {

    @Override
    public Skill toEntity(SkillRequest request) {
        if ( request == null ) {
            return null;
        }

        Skill.SkillBuilder skill = Skill.builder();

        skill.name( request.getName() );

        return skill.build();
    }

    @Override
    public SkillResponse toResponse(Skill skill) {
        if ( skill == null ) {
            return null;
        }

        SkillResponse.SkillResponseBuilder skillResponse = SkillResponse.builder();

        skillResponse.id( skill.getId() );
        skillResponse.name( skill.getName() );

        return skillResponse.build();
    }

    @Override
    public void updateEntity(Skill skill, SkillRequest request) {
        if ( request == null ) {
            return;
        }

        skill.setName( request.getName() );
    }
}
