package com.TopCV.service.impl;

import com.TopCV.dto.request.SkillRequest;
import com.TopCV.dto.response.SkillResponse;
import com.TopCV.entity.Skill;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.mapper.SkillMapper;
import com.TopCV.repository.SkillRepository;
import com.TopCV.service.SkillService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SkillServiceImpl implements SkillService {

    SkillRepository skillRepository;
    SkillMapper skillMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public SkillResponse createSkill(SkillRequest request) {
        if (skillRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.SKILL_NAME_EXISTED);
        }

        Skill skill = skillMapper.toEntity(request);
        return skillMapper.toResponse(skillRepository.save(skill));
    }

    @Override
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(skillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SkillResponse getSkillById(Integer id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SKILL_NOT_EXISTED));
        return skillMapper.toResponse(skill);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public SkillResponse updateSkill(Integer skillId, SkillRequest request) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new AppException(ErrorCode.SKILL_NOT_EXISTED));

        skillMapper.updateEntity(skill, request);
        return skillMapper.toResponse(skillRepository.save(skill));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSkill(Integer skillId) {
        if (!skillRepository.existsById(skillId)) {
            throw new AppException(ErrorCode.SKILL_NOT_EXISTED);
        }
        skillRepository.deleteById(skillId);
    }
}