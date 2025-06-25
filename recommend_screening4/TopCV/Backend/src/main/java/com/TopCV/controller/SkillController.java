package com.TopCV.controller;

import com.TopCV.dto.request.SkillRequest;
import com.TopCV.dto.response.ApiResponse;
import com.TopCV.dto.response.SkillResponse;
import com.TopCV.service.SkillService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SkillController {

    SkillService skillService;

    @PostMapping
    ApiResponse<SkillResponse> createSkill(@RequestBody @Valid SkillRequest request) {
        return ApiResponse.<SkillResponse>builder()
                .result(skillService.createSkill(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<SkillResponse>> getAllSkills() {
        return ApiResponse.<List<SkillResponse>>builder()
                .result(skillService.getAllSkills())
                .build();
    }

    @GetMapping("/{skill_id}")
    ApiResponse<SkillResponse> getSkill(@PathVariable("skill_id") Integer skillId) {
        return ApiResponse.<SkillResponse>builder()
                .result(skillService.getSkillById(skillId))
                .build();
    }

    @PutMapping("/{skill_id}")
    ApiResponse<SkillResponse> updateSkill(
            @PathVariable("skill_id") Integer skillId,
            @RequestBody @Valid SkillRequest request) {
        return ApiResponse.<SkillResponse>builder()
                .result(skillService.updateSkill(skillId, request))
                .build();
    }

    @DeleteMapping("/{skill_id}")
    ApiResponse<String> deleteSkill(@PathVariable("skill_id") Integer skillId) {
        skillService.deleteSkill(skillId);
        return ApiResponse.<String>builder()
                .result("Skill has been deleted")
                .build();
    }
}