package com.TopCV.service;

import com.TopCV.dto.request.SkillRequest;
import com.TopCV.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {
    SkillResponse createSkill(SkillRequest request);
    List<SkillResponse> getAllSkills();
    SkillResponse getSkillById(Integer id);
    SkillResponse updateSkill(Integer skillId, SkillRequest request);
    void deleteSkill(Integer skillId);
}