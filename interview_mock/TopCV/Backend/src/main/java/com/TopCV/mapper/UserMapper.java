package com.TopCV.mapper;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.UserUpdateRequest;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    User toEntity(UserCreationRequest request);

    @Mapping(target = "isEmailVerified", source = "emailVerified")
    UserResponse toResponse(User user);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
